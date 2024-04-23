package listings

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
)

type DBLocation struct {
	Location  model.ListingLocations
	DBCountry struct {
		Country      model.Countries
		Translations model.CountriesI18n
	}

	DBCity struct {
		City         model.Cities
		Translations model.CitiesI18n
	}

	DBArea struct {
		Area         model.Areas
		Translations model.AreasI18n
	}
}

type DBType struct {
	Type         model.ListingTypes
	Translations model.ListingTypesI18n
}

type DBAvailability struct {
	Availability        model.Availabilities
	Price               model.ListingAvailabilityPrices
	ListingAvailability model.ListingAvailabilities
}

type DBExtraFeature struct {
	ExtraFeature model.ListingExtraFeatures
	Translations model.ListingExtraFeaturesI18n
}

type DBProperty struct {
	Property     model.Properties
	Translations model.PropertiesI18n
}

type dbListing struct {
	Listing             model.Listings
	ListingTranslations model.ListingsI18n

	ExtraFeatures []DBExtraFeature

	Availabilities []DBAvailability
	Location       DBLocation

	Property *DBProperty

	Type DBType

	Pictures []model.ListingPictures
}

func (l *dbListing) ToEntity() Listing {
	extraFeatures := make([]ExtraFeature, len(l.ExtraFeatures))
	for index, extraFeature := range l.ExtraFeatures {
		t := extraFeature.Translations
		extraFeatures[index] = ExtraFeature{
			ID:        int(extraFeature.ExtraFeature.ID),
			Title:     t.Title,
			Available: extraFeature.ExtraFeature.Available,
		}
	}

	pictures := make([]Picture, len(l.Pictures))
	for index, picture := range l.Pictures {
		pictures[index] = Picture{
			ID:    int(picture.ID),
			Title: picture.Title,
			URL:   picture.URL,
		}
	}

	availabilities := make([]Availability, len(l.Availabilities))
	for index, availability := range l.Availabilities {
		availabilities[index] = Availability{
			Availability: availability.Availability.Code,
			Price: Price{
				Amount:   availability.Price.Amount,
				Currency: availability.Price.Currency,
			},
		}
	}

	listing := Listing{
		ID:             int(l.Listing.ID),
		Type:           l.Type.Translations.Name,
		Description:    *l.ListingTranslations.Description,
		ExtraFeatures:  extraFeatures,
		Pictures:       pictures,
		Availabilities: availabilities,
		Location: Location{
			Country: NamedValue{Name: l.Location.DBCountry.Translations.Name},
			City:    NamedValue{Name: l.Location.DBCity.Translations.Name},
			Area:    NamedValue{Name: l.Location.DBArea.Translations.Name},
		},
	}

	if l.Property != nil {
		listing.Property = &Property{
			Bedrooms: DescribedValue[int]{
				Value:       int(l.Property.Property.Bedrooms),
				Description: l.Property.Translations.BedroomsDescription,
			},
			Bathrooms: DescribedValue[int]{
				Value:       int(l.Property.Property.Bathrooms),
				Description: l.Property.Translations.BathroomsDescription,
			},
			Area: DescribedValue[float64]{
				Value:       l.Property.Property.Area,
				Description: l.Property.Translations.AreaDescription,
			},
			Furnished: DescribedValue[bool]{
				Value:       l.Property.Property.Furnished,
				Description: l.Property.Translations.FurnishedDescription,
			},
			YearBuilt: DescribedValue[int]{
				Value:       int(l.Property.Property.YearBuilt),
				Description: l.Property.Translations.YearBuiltDescription,
			},
		}
	}

	return listing
}
