package listings

type ListingAvailability string

const (
	ListingAvailabilityRent ListingAvailability = "RENT"
	ListingAvailabilitySale ListingAvailability = "SALE"
)

type PropertyStatus string

const (
	PropertyStatusActive PropertyStatus = "ACTIVE"
	PropertyStatusRented PropertyStatus = "RENTED"
	PropertyStatusSold   PropertyStatus = "SOLD"
)

type (
	ExtraFeature struct {
		ID        int    `json:"id,omitempty"`
		ListingID int    `json:"-"`
		Title     string `json:"title,omitempty"`
		Available bool   `json:"available"`
	}

	Picture struct {
		ID          int     `json:"id,omitempty"`
		ListingID   int     `json:"-"`
		Title       *string `json:"title,omitempty"`
		URL         string  `json:"url,omitempty"`
		Highlighted bool    `json:"highlighted"`
	}

	Price struct {
		Amount   float64 `json:"amount,omitempty"`
		Currency string  `json:"currency,omitempty"`
	}

	Availability struct {
		ID           int    `json:"-"`
		Availability string `json:"availability,omitempty"`
		Price        Price  `json:"price,omitempty"`
	}

	Location struct {
		ID      int        `json:"id,omitempty"`
		Country NamedValue `json:"country,omitempty"`
		City    NamedValue `json:"city,omitempty"`
		Area    NamedValue `json:"area,omitempty"`
	}

	NamedValue struct {
		ID   int    `json:"id,omitempty"`
		Name string `json:"name,omitempty"`
	}

	DescribedValue[T any] struct {
		Value       T       `json:"value"`
		Description *string `json:"description,omitempty"`
	}

	Property struct {
		ID        int                     `json:"-"`
		ListingID int                     `json:"-"`
		Bedrooms  DescribedValue[int]     `json:"bedrooms,omitempty"`
		Bathrooms DescribedValue[int]     `json:"bathrooms,omitempty"`
		Area      DescribedValue[float64] `json:"area,omitempty"`
		Furnished DescribedValue[bool]    `json:"furnished,omitempty"`
		YearBuilt DescribedValue[int]     `json:"yearBuilt,omitempty"`
		Status    string                  `json:"status,omitempty"`
	}

	Listing struct {
		ID             int            `json:"id,omitempty"`
		AgencyID       int            `json:"agencyId,omitempty"`
		Type           string         `json:"type"`
		Description    string         `json:"description,omitempty"`
		ExtraFeatures  []ExtraFeature `json:"extraFeatures,omitempty"`
		Pictures       []Picture      `json:"pictures,omitempty"`
		Availabilities []Availability `json:"availabilities,omitempty"`
		Location       Location       `json:"location,omitempty"`
		Property       *Property      `json:"property,omitempty"`
	}
)

func NewListing() Listing {
	return Listing{
		ExtraFeatures:  make([]ExtraFeature, 0),
		Pictures:       make([]Picture, 0),
		Availabilities: make([]Availability, 0),
	}
}

type ListingI18n struct {
	ListingID    int
	LanguageCode string
	Description  string
}

type ExtraFeatureI18n struct {
	ExtraFeatureID int
	LanguageCode   string
	Title          string
}

type PropertyI18n struct {
	PropertyID           int
	LanguageCode         string
	BedroomsDescription  string
	BathroomsDescription string
	AreaDescription      string
	FurnishedDescription string
	YearBuiltDescription string
}

type ListingType struct {
	Name string `json:"name,omitempty"`
	Code string `json:"code,omitempty"`
}
