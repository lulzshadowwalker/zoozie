package listings

import (
	"log"
	"time"

	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
)

type dbListing struct {
	Listing             model.Listings
	ListingTranslations model.ListingsI18n

	ExtraFeatures []struct {
		ExtraFeature model.ListingExtraFeatures
		Translations model.ListingExtraFeaturesI18n
	}

	Availabilities []struct {
		Availability        model.Availabilities
		Price               model.ListingAvailabilityPrices
		ListingAvailability model.ListingAvailabilities
	}

	Location struct {
		Country struct {
			Country      model.Countries
			Translations model.CountriesI18n
		}

		City struct {
			City         model.Cities
			Translations model.CitiesI18n
		}

		Area struct {
			Area         model.Areas
			Translations model.AreasI18n
		}
	}

	Property *struct {
		Property     model.Properties
		Translations model.PropertiesI18n
	}

	Type struct {
		Type         model.ListingTypes
		Translations model.ListingTypesI18n
	}

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

	pictures := make([]File, len(l.Pictures))
	for index, picture := range l.Pictures {
		pictures[index] = File{
			ID:    int(picture.ID),
			Title: picture.Title,
			Url:   picture.URL,
		}
	}

	availabilities := make([]Availability, len(l.Availabilities))
	for index, availability := range l.Availabilities {

		log.Println("index:", index, "avail:", availability.Availability.Code, "price:", availability.Price.Amount)
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
			Country: l.Location.Country.Translations.Name,
			City:    l.Location.City.Translations.Name,
			Area:    l.Location.Area.Translations.Name,
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
			YearBuilt: DescribedValue[time.Time]{
				Value:       l.Property.Property.YearBuilt,
				Description: l.Property.Translations.YearBuiltDescription,
			},
		}
	}

	return listing
}
