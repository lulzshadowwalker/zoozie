package listings

type (
	ExtraFeature struct {
		ID     int    `json:"id,omitempty"`
		Title  string `json:"title,omitempty"`
		Exists bool   `json:"exists,omitempty"`
	}

	CoreFeature struct {
		ID            int    `json:"id,omitempty"`
		CoreFeatureID int    `json:"coreFeatureId,omitempty"`
		Title         string `json:"title,omitempty"`
		Description   string `json:"description,omitempty"`
	}

	File struct {
		ID    int     `json:"id,omitempty"`
		Title *string `json:"title,omitempty,omitempty"`
		Url   string  `json:"url,omitempty"`
	}

	Price struct {
		ID       int     `json:"id,omitempty"`
		Amount   float64 `json:"amount,omitempty"`
		Currency string  `json:"currency,omitempty"`
	}

	Listing struct {
		ID            int            `json:"id,omitempty"`
		Price         Price          `json:"price,omitempty"`
		Description   string         `json:"description,omitempty"`
		CoreFeatures  []CoreFeature  `json:"coreFeatures,omitempty"`
		ExtraFeatures []ExtraFeature `json:"extraFeatures,omitempty"`
		Pictures      []File         `json:"pictures,omitempty"`
	}
)

func NewListing() Listing {
	return Listing{
		CoreFeatures:  make([]CoreFeature, 0),
		ExtraFeatures: make([]ExtraFeature, 0),
		Pictures:      make([]File, 0),
	}
}
