package models

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/model"
	"github.com/lulzshadowwalker/zoozie/api/internal/entity"
)

type Listing struct {
	Listing             model.Listings
	ListingTranslations model.ListingsI18n

	ListingCoreFeatures             []model.ListingCoreFeatures
	ListingCoreFeaturesTranslations []model.ListingCoreFeaturesI18n

	ListingExtraFeatures             []model.ListingExtraFeatures
	ListingExtraFeaturesTranslations []model.ListingExtraFeaturesI18n

	ListingPrices model.ListingPrices

	Pictures []model.ListingPictures
}

func (l *Listing) ToEntity() entity.Listing {
	coreFeatures := make([]entity.ListingCoreFeature, len(l.ListingCoreFeatures))
	for index, coreFeature := range l.ListingCoreFeatures {
		t := l.ListingCoreFeaturesTranslations[index]

		coreFeatures[index] = entity.ListingCoreFeature{
			CoreFeatureID: int(coreFeature.CoreFeatureID),
			Title:         t.Title,
			Description:   t.Description,
		}
	}

	extraFeatures := make([]entity.ListingExtraFeature, len(l.ListingExtraFeatures))
	for index, extraFeature := range l.ListingExtraFeatures {
		t := l.ListingExtraFeaturesTranslations[index]
		extraFeatures[index] = entity.ListingExtraFeature{
			ID:     int(extraFeature.ID),
			Title:  t.Title,
			Exists: extraFeature.Exists,
		}
	}

	pictures := make([]entity.ListingFile, len(l.Pictures))
	for index, picture := range l.Pictures {
		pictures[index] = entity.ListingFile{
			ID:    int(picture.ID),
			Title: picture.Title,
			Url:   picture.URL,
		}
	}

	return entity.Listing{
		Price:         entity.ListingPrice{Amount: l.ListingPrices.Amount, Currency: l.ListingPrices.Currency},
		Description:   l.ListingTranslations.Description,
		CoreFeatures:  coreFeatures,
		ExtraFeatures: extraFeatures,
		Pictures:      pictures,
	}
}
