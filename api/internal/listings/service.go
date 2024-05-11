package listings

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"slices"
	"strings"

	"github.com/go-jet/jet/v2/qrm"
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type listingOptions struct {
	expand []string
}

type (
	service struct {
		repo Repo
	}

	Repo interface {
		Begin(context.Context) (interfaces.Transaction, error)
		GetListing(c context.Context, id int) (Listing, error)
		GetAllListings(c context.Context, filters filters) ([]Listing, error)
		GetListingTypes(context.Context, interfaces.Transaction) ([]ListingType, error)
		GetListingLocations(context.Context, interfaces.Transaction) ([]Location, error)
		GetListingsByCustomerID(context.Context, int, interfaces.Transaction) ([]Listing, error)
		GetAgencyByID(context.Context, int, interfaces.Transaction) (*agencies.Agency, error)

		ToggleListingFavorite(c context.Context, customerID, listingID int, tx interfaces.Transaction) (bool, error)

		CreateListing(context.Context, Listing, interfaces.Transaction) (Listing, error)
		CreateListingI18n(context.Context, ListingI18n, interfaces.Transaction) (ListingI18n, error)

		CreateListingExtraFeature(context.Context, ExtraFeature, interfaces.Transaction) (ExtraFeature, error)
		CreateListingExtraFeatureI18n(context.Context, ExtraFeatureI18n, interfaces.Transaction) (ExtraFeatureI18n, error)

		CreateListingPictures(context.Context, []Picture, interfaces.Transaction) ([]Picture, error)
		CreateListingAvailability(context.Context, Availability, interfaces.Transaction) (Availability, error)
		CreateListingLocation(context.Context, Location, interfaces.Transaction) (Location, error)

		CreateProperty(context.Context, Property, interfaces.Transaction) (Property, error)
		CreatePropertyI18n(context.Context, PropertyI18n, interfaces.Transaction) (PropertyI18n, error)
	}
)

func NewService(repo Repo) *service {
	return &service{repo: repo}
}

func (s *service) CreateListing(c context.Context, request createListingRequest) error {
	tx, err := s.repo.Begin(c)
	if err != nil {
		return fmt.Errorf("failed to begin transaction because %w", err)
	}
	defer tx.Rollback()

	agencyID, err := utils.GetAgencyID(c)
	if err != nil {
		return err
	}

	location := Location{
		Country: Country{
			ID: request.Location.CountryID,
		},
		City: City{
			ID: request.Location.CityID,
		},
		Area: Area{
			ID: request.Location.AreaID,
		},
	}
	location, err = s.repo.CreateListingLocation(c, location, tx)
	if err != nil {
		return err
	}

	listing := Listing{
		AgencyID: agencyID,
		Type:     request.Type,
		Location: location,
	}
	listing, err = s.repo.CreateListing(c, listing, tx)
	if err != nil {
		return err
	}

	listingI18n := []ListingI18n{
		{
			ListingID:    listing.ID,
			LanguageCode: "en",
			Description:  strings.Trim(request.DescriptionEnglish, " "),
		},
		{
			ListingID:    listing.ID,
			LanguageCode: "ar",
			Description:  strings.Trim(request.DescriptionArabic, " "),
		},
	}

	for index := range listingI18n {
		listingI18n[index], err = s.repo.CreateListingI18n(c, listingI18n[index], tx)
		if err != nil {
			return err
		}
	}

	extraFeatures := make([]ExtraFeature, len(request.ExtraFeatures))
	for index := range request.ExtraFeatures {
		extraFeatures[index] = ExtraFeature{
			ListingID: listing.ID,
			Available: request.ExtraFeatures[index].Exists,
		}

		extraFeatures[index], err = s.repo.CreateListingExtraFeature(c, extraFeatures[index], tx)
		if err != nil {
			return err
		}

		extraFeatureI18n := []ExtraFeatureI18n{
			{
				ExtraFeatureID: extraFeatures[index].ID,
				LanguageCode:   "en",
				Title:          strings.Trim(request.ExtraFeatures[index].TitleEnglish, " "),
			},
			{
				ExtraFeatureID: extraFeatures[index].ID,
				LanguageCode:   "ar",
				Title:          strings.Trim(request.ExtraFeatures[index].TitleArabic, " "),
			},
		}
		for index := range extraFeatureI18n {
			extraFeatureI18n[index], err = s.repo.CreateListingExtraFeatureI18n(c, extraFeatureI18n[index], tx)
			if err != nil {
				return err
			}
		}
	}

	pictures := make([]Picture, len(request.Pictures))
	for index := range request.Pictures {
		pictures[index] = Picture{
			ListingID: listing.ID,
			Title:     &request.Pictures[index].Title,
			URL:       request.Pictures[index].URL,
		}
	}
	_, err = s.repo.CreateListingPictures(c, pictures, tx)
	if err != nil {
		return err
	}

	availability := make([]Availability, len(request.Availabilities))
	for index := range request.Availabilities {
		availability[index] = Availability{
			Availability: request.Availabilities[index].Availability,
			Price: Price{
				Amount:   request.Availabilities[index].Price.Amount,
				Currency: request.Availabilities[index].Price.Currency,
			},
		}

		availability[index], err = s.repo.CreateListingAvailability(c, availability[index], tx)
		if err != nil {
			return err
		}
	}

	property := Property{
		ListingID: listing.ID,
		Bedrooms: DescribedValue[int]{
			Value: request.Bedrooms,
		},
		Bathrooms: DescribedValue[int]{
			Value: request.Bathrooms,
		},
		Area: DescribedValue[float64]{
			Value: request.Area,
		},
		Furnished: DescribedValue[bool]{
			Value: request.Furnished,
		},
		YearBuilt: DescribedValue[int]{
			Value: request.YearBuilt,
		},
	}
	property, err = s.repo.CreateProperty(c, property, tx)
	if err != nil {
		return err
	}

	propertyI18n := []PropertyI18n{
		{
			PropertyID:           property.ID,
			LanguageCode:         "en",
			BedroomsDescription:  strings.Trim(request.BedroomsDescriptionEnglish, " "),
			BathroomsDescription: strings.Trim(request.BathroomsDescriptionEnglish, " "),
			AreaDescription:      strings.Trim(request.AreaDescriptionEnglish, " "),
			FurnishedDescription: strings.Trim(request.FurnishedDescriptionEnglish, " "),
			YearBuiltDescription: strings.Trim(request.YearBuiltDescriptionEnglish, " "),
		},
		{
			PropertyID:           property.ID,
			LanguageCode:         "ar",
			BedroomsDescription:  strings.Trim(request.BedroomsDescriptionArabic, " "),
			BathroomsDescription: strings.Trim(request.BathroomsDescriptionArabic, " "),
			AreaDescription:      strings.Trim(request.AreaDescriptionArabic, " "),
			FurnishedDescription: strings.Trim(request.FurnishedDescriptionArabic, " "),
			YearBuiltDescription: strings.Trim(request.YearBuiltDescriptionArabic, " "),
		},
	}
	for index := range propertyI18n {
		propertyI18n[index], err = s.repo.CreatePropertyI18n(c, propertyI18n[index], tx)
		if err != nil {
			return err
		}
	}

	tx.Commit()
	return nil
}

func (s *service) GetListing(c context.Context, request getListingRequest) (Listing, error) {
	listing, err := s.repo.GetListing(c, request.ID)
	if err != nil {
		return Listing{}, err
	}

	if res := slices.Index(request.Expand, "agency"); res != -1 {
		listing.Agency, err = s.repo.GetAgencyByID(c, listing.AgencyID, nil)
		if err != nil {
			if errors.Is(err, qrm.ErrNoRows) {
				slog.ErrorContext(c, "failed to get agency", "err", err)
				return Listing{}, utils.NewApiError(http.StatusInternalServerError, "")
			}
			return Listing{}, err
		}
	}

	return listing, nil
}

func (s *service) GetAllListings(c context.Context, request getListingsRequest) ([]Listing, error) {
	return s.repo.GetAllListings(c, request.toFilters())
}

func (s *service) GetListingTypes(c context.Context) ([]ListingType, error) {
	return s.repo.GetListingTypes(c, nil)
}

func (s *service) GetListingLocations(c context.Context) ([]Location, error) {
	return s.repo.GetListingLocations(c, nil)
}

func (s *service) GetCustomerFavorites(c context.Context) ([]Listing, error) {
	customerID, err := utils.GetCustomerID(c)
	if err != nil {
		return nil, err
	}

	return s.repo.GetListingsByCustomerID(c, customerID, nil)
}

func (s *service) ToggleListingFavorite(c context.Context, request toggleListingFavoriteRequest) (bool, error) {
	customerID, err := utils.GetCustomerID(c)
	if err != nil {
		return false, err
	}

	return s.repo.ToggleListingFavorite(c, customerID, request.ListingID, nil)
}
