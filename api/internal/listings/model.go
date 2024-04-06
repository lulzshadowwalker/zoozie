package listings

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/model"
)

type dbListing struct {
	Listing             model.Listings
	ListingTranslations model.ListingsI18n

	ListingCoreFeatures             []model.ListingCoreFeatures
	ListingCoreFeaturesTranslations []model.ListingCoreFeaturesI18n

	ListingExtraFeatures             []model.ListingExtraFeatures
	ListingExtraFeaturesTranslations []model.ListingExtraFeaturesI18n

	ListingPrices model.ListingPrices

	Pictures []model.ListingPictures
}

func (l *dbListing) ToEntity() Listing {
	coreFeatures := make([]CoreFeature, len(l.ListingCoreFeatures))
	for index, coreFeature := range l.ListingCoreFeatures {
		t := l.ListingCoreFeaturesTranslations[index]

		coreFeatures[index] = CoreFeature{
			CoreFeatureID: int(coreFeature.CoreFeatureID),
			Title:         t.Title,
			Description:   t.Description,
		}
	}

	extraFeatures := make([]ExtraFeature, len(l.ListingExtraFeatures))
	for index, extraFeature := range l.ListingExtraFeatures {
		t := l.ListingExtraFeaturesTranslations[index]
		extraFeatures[index] = ExtraFeature{
			ID:     int(extraFeature.ID),
			Title:  t.Title,
			Exists: extraFeature.Exists,
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
		Price:         Price{Amount: l.ListingPrices.Amount, Currency: l.ListingPrices.Currency},
		Description:   l.ListingTranslations.Description,
		CoreFeatures:  coreFeatures,
		ExtraFeatures: extraFeatures,
		Pictures:      pictures,
	}
}
