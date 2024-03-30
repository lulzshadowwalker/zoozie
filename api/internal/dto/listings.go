package dto

import "github.com/lulzshadowwalker/zoozie/api/internal/models"

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
		Title string `json:"title,omitempty" validate:"required"`
		Url   string `json:"url,omitempty" validate:"required,url"`
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

	CreateListingResponse struct {
		Price         ListingPrice          `json:"price,omitempty"`
		Description   string                `json:"description,omitempty"`
		CoreFeatures  []ListingCoreFeature  `json:"coreFeatures,omitempty"`
		ExtraFeatures []ListingExtraFeature `json:"extraFeatures,omitempty"`
		Pictures      []ListingFile         `json:"pictures,omitempty"`
	}
)

func ListingResponseFromEntity(listing models.Listing) CreateListingResponse {
	response := CreateListingResponse{
		Price: ListingPrice{
			Amount:   listing.Price.Amount,
			Currency: listing.Price.Currency,
		},
		Description:   listing.Description,
		CoreFeatures:  make([]ListingCoreFeature, len(listing.CoreFeatures)),
		ExtraFeatures: make([]ListingExtraFeature, len(listing.ExtraFeatures)),
		Pictures:      make([]ListingFile, len(listing.Pictures)),
	}

	for i, coreFeature := range listing.CoreFeatures {
		response.CoreFeatures[i] = ListingCoreFeature{
			CoreFeatureID: coreFeature.CoreFeatureID,
			Title:         coreFeature.Title,
			Description:   coreFeature.Description,
		}
	}

	for i, extraFeature := range listing.ExtraFeatures {
		response.ExtraFeatures[i] = ListingExtraFeature{
			Title:  extraFeature.Title,
			Exists: extraFeature.Exists,
		}
	}

	for i, picture := range listing.Pictures {
		response.Pictures[i] = ListingFile{
			Title: picture.Title,
			Url:   picture.Url,
		}
	}

	return response
}

func (r *CreateListingRequest) ToEntity() models.Listing {
	listing := models.Listing{
		Price:         models.ListingPrice{Amount: r.Price.Amount, Currency: r.Price.Currency},
		Description:   r.Description,
		CoreFeatures:  make([]models.ListingCoreFeature, len(r.CoreFeatures)),
		ExtraFeatures: make([]models.ListingExtraFeature, len(r.ExtraFeatures)),
		Pictures:      make([]models.ListingFile, len(r.Pictures)),
	}

	for i, coreFeature := range r.CoreFeatures {
		listing.CoreFeatures[i] = models.ListingCoreFeature{
			CoreFeatureID: coreFeature.CoreFeatureID,
			Title:         coreFeature.Title,
			Description:   coreFeature.Description,
		}
	}

	for i, extraFeature := range r.ExtraFeatures {
		listing.ExtraFeatures[i] = models.ListingExtraFeature{
			Title:  extraFeature.Title,
			Exists: extraFeature.Exists,
		}
	}

	for i, picture := range r.Pictures {
		listing.Pictures[i] = models.ListingFile{
			Title: picture.Title,
			Url:   picture.Url,
		}
	}

	return listing
}
