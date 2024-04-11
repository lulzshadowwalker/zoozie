package listings

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
)

type dbListing struct {
	Listing             model.Listings
	ListingTranslations model.ListingsI18n

	ListingExtraFeatures             []model.ListingExtraFeatures
	ListingExtraFeaturesTranslations []model.ListingExtraFeaturesI18n

	Pictures []model.ListingPictures
}

func (l *dbListing) ToEntity() Listing {
	extraFeatures := make([]ExtraFeature, len(l.ListingExtraFeatures))
	for index, extraFeature := range l.ListingExtraFeatures {
		t := l.ListingExtraFeaturesTranslations[index]
		extraFeatures[index] = ExtraFeature{
			ID:     int(extraFeature.ID),
			Title:  t.Title,
			Exists: extraFeature.Available,
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

	return Listing{
		Description:   *l.ListingTranslations.Description,
		ExtraFeatures: extraFeatures,
		Pictures:      pictures,
	}
}
