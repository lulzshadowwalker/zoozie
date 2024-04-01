package dto

import "github.com/lulzshadowwalker/zoozie/api/internal/entity"

type (
	ListingExtraFeature struct {
		Title  string `json:"title,omitempty" validate:"required"`
		Exists bool   `json:"exists,omitempty" validate:"boolean"`
	}

	ListingCoreFeature struct {
		CoreFeatureID int    `json:"coreFeatureId,omitempty" validate:"required,number,gt=0"`
		Title         string `json:"title,omitempty" validate:"required"`
		Description   string `json:"description"`
	}

	ListingFile struct {
		Title *string `json:"title,omitempty" validate:"required"`
		Url   string  `json:"url,omitempty" validate:"required,url"`
	}

	ListingPrice struct {
		Amount   float64 `json:"amount,omitempty" validate:"required,number,gt=0"`
		Currency string  `json:"currency,omitempty" validate:"required,oneof=JOD USD"`
	}

	CreateListingRequest struct {
		Price         ListingPrice          `json:"price,omitempty" validate:"required"`
		Description   string                `json:"description,omitempty" validate:"required"`
		CoreFeatures  []ListingCoreFeature  `json:"coreFeatures,omitempty" validate:"required,dive"`
		ExtraFeatures []ListingExtraFeature `json:"extraFeatures,omitempty" validate:"dive"`
		Pictures      []ListingFile         `json:"pictures,omitempty" validate:"required,dive"`
	}

	GetListingRequest struct {
		ID int `param:"id" validate:"required,number,gt=0"`
	}
)

func (r *CreateListingRequest) ToEntity() entity.Listing {
	listing := entity.Listing{
		Price:         entity.ListingPrice{Amount: r.Price.Amount, Currency: r.Price.Currency},
		Description:   r.Description,
		CoreFeatures:  make([]entity.ListingCoreFeature, len(r.CoreFeatures)),
		ExtraFeatures: make([]entity.ListingExtraFeature, len(r.ExtraFeatures)),
		Pictures:      make([]entity.ListingFile, len(r.Pictures)),
	}

	for i, coreFeature := range r.CoreFeatures {
		listing.CoreFeatures[i] = entity.ListingCoreFeature{
			CoreFeatureID: coreFeature.CoreFeatureID,
			Title:         coreFeature.Title,
			Description:   coreFeature.Description,
		}
	}

	for i, extraFeature := range r.ExtraFeatures {
		listing.ExtraFeatures[i] = entity.ListingExtraFeature{
			Title:  extraFeature.Title,
			Exists: extraFeature.Exists,
		}
	}

	for i, picture := range r.Pictures {
		listing.Pictures[i] = entity.ListingFile{
			Title: picture.Title,
			Url:   picture.Url,
		}
	}

	return listing
}
