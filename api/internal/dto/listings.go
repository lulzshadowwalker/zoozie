package dto

type (
	ListingExtraFeature struct {
		Title  string `json:"title" validate:"required"`
		Exists bool   `json:"exists" validate:"required,boolean"`
	}

	ListingCoreFeature struct {
		Id          int    `json:"id" validate:"required,number,gt=0"`
		Title       string `json:"title" validate:"required"`
		Description string `json:"description"`
	}

	ListingFile struct {
		Filename string `json:"filename" validate:"required"`
		Base64   string `json:"base64" validate:"required"`
	}

	CreateListingRequest struct {
		Price         float64               `json:"price" validate:"required,number,gt=0"`
		Description   string                `json:"description" validate:"required"`
		CoreFeatures  []ListingCoreFeature  `json:"coreFeatures" validate:"required,dive"`
		ExtraFeatures []ListingExtraFeature `json:"extraFeatures" validate:"dive"`
		Pictures      []ListingFile         `json:"pictures" validate:"required,dive"`
	}

	CreateListingResponse struct {
		Pictures []string `json:"pictures"`
	}
)
