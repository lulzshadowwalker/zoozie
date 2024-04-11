package listings

type (
	ResponseExtraFeature struct {
		Title  string `json:"title,omitempty" validate:"required"`
		Exists bool   `json:"exists,omitempty" validate:"boolean"`
	}

	ResponseCoreFeature struct {
		CoreFeatureID int    `json:"coreFeatureId,omitempty" validate:"required,number,gt=0"`
		Title         string `json:"title,omitempty" validate:"required"`
		Description   string `json:"description"`
	}

	ResponseFile struct {
		Title *string `json:"title,omitempty" validate:"required"`
		Url   string  `json:"url,omitempty" validate:"required,url"`
	}

	ResponsePrice struct {
		Amount   float64 `json:"amount,omitempty" validate:"required,number,gt=0"`
		Currency string  `json:"currency,omitempty" validate:"required,oneof=JOD USD"`
	}

	createListingRequest struct {
		Price         Price          `json:"price,omitempty" validate:"required"`
		Description   string         `json:"description,omitempty" validate:"required"`
		ExtraFeatures []ExtraFeature `json:"extraFeatures,omitempty" validate:"dive"`
		Pictures      []File         `json:"pictures,omitempty" validate:"required,dive"`
	}

	responseListing = createListingRequest

	getListingRequest struct {
		ID int `param:"id" validate:"required,number"`
	}
)

func (r *createListingRequest) ToEntity() Listing {
	listing := Listing{
		Description:   r.Description,
		ExtraFeatures: make([]ExtraFeature, len(r.ExtraFeatures)),
		Pictures:      make([]File, len(r.Pictures)),
	}

	for i, extraFeature := range r.ExtraFeatures {
		listing.ExtraFeatures[i] = ExtraFeature{
			Title:     extraFeature.Title,
			Available: extraFeature.Available,
		}
	}

	for i, picture := range r.Pictures {
		listing.Pictures[i] = File{
			Title: picture.Title,
			Url:   picture.Url,
		}
	}

	return listing
}
