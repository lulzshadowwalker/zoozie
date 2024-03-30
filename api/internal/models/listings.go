package models

type (
	ListingExtraFeature struct {
		ID     int
		Title  string
		Exists bool
	}

	ListingCoreFeature struct {
		ID            int
		CoreFeatureID int
		Title         string
		Description   string
	}

	ListingFile struct {
		ID    int
		Title string
		Url   string
	}

	ListingPrice struct {
		ID       int
		Amount   float64
		Currency string
	}

	Listing struct {
		ID            int
		Price         ListingPrice
		Description   string
		CoreFeatures  []ListingCoreFeature
		ExtraFeatures []ListingExtraFeature
		Pictures      []ListingFile
	}
)
