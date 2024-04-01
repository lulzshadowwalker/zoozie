package entity

type (
	ListingExtraFeature struct {
		ID     int    `json:"id,omitempty"`
		Title  string `json:"title,omitempty"`
		Exists bool   `json:"exists,omitempty"`
	}

	ListingCoreFeature struct {
		ID            int    `json:"id,omitempty"`
		CoreFeatureID int    `json:"coreFeatureId,omitempty"`
		Title         string `json:"title,omitempty"`
		Description   string `json:"description,omitempty"`
	}

	ListingFile struct {
		ID    int     `json:"id,omitempty"`
		Title *string `json:"title,omitempty,omitempty"`
		Url   string  `json:"url,omitempty"`
	}

	ListingPrice struct {
		ID       int     `json:"id,omitempty"`
		Amount   float64 `json:"amount,omitempty"`
		Currency string  `json:"currency,omitempty"`
	}

	Listing struct {
		ID            int                   `json:"id,omitempty"`
		Price         ListingPrice          `json:"price,omitempty"`
		Description   string                `json:"description,omitempty"`
		CoreFeatures  []ListingCoreFeature  `json:"coreFeatures,omitempty"`
		ExtraFeatures []ListingExtraFeature `json:"extraFeatures,omitempty"`
		Pictures      []ListingFile         `json:"pictures,omitempty"`
	}
)

func NewListing() Listing {
	return Listing{
		CoreFeatures:  make([]ListingCoreFeature, 0),
		ExtraFeatures: make([]ListingExtraFeature, 0),
		Pictures:      make([]ListingFile, 0),
	}
}
