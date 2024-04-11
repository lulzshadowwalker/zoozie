package listings

import "time"

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
		Title     string `json:"title,omitempty"`
		Available bool   `json:"available"`
	}

	File struct {
		ID    int     `json:"id,omitempty"`
		Title *string `json:"title,omitempty"`
		Url   string  `json:"url,omitempty"`
	}

	Price struct {
		Amount   float64 `json:"amount,omitempty"`
		Currency string  `json:"currency,omitempty"`
	}

	Availability struct {
		Availability string `json:"availability,omitempty"`
		Price        Price  `json:"price,omitempty"`
	}

	Location struct {
		Country string `json:"country,omitempty"`
		City    string `json:"city,omitempty"`
		Area    string `json:"area,omitempty"`
	}

	DescribedValue[T any] struct {
		Value       T       `json:"value"`
		Description *string `json:"description,omitempty"`
	}

	Property struct {
		Bedrooms  DescribedValue[int]       `json:"bedrooms,omitempty"`
		Bathrooms DescribedValue[int]       `json:"bathrooms,omitempty"`
		Area      DescribedValue[float64]   `json:"area,omitempty"`
		Furnished DescribedValue[bool]      `json:"furnished,omitempty"`
		YearBuilt DescribedValue[time.Time] `json:"yearBuilt,omitempty"`
		Status    string                    `json:"status,omitempty"`
	}

	Listing struct {
		ID             int            `json:"id,omitempty"`
		Type           string         `json:"type"`
		Description    string         `json:"description,omitempty"`
		ExtraFeatures  []ExtraFeature `json:"extraFeatures,omitempty"`
		Pictures       []File         `json:"pictures,omitempty"`
		Availabilities []Availability `json:"availabilities,omitempty"`
		Location       Location       `json:"location,omitempty"`
		Property       *Property      `json:"property,omitempty"`
	}
)

func NewListing() Listing {
	return Listing{
		ExtraFeatures:  make([]ExtraFeature, 0),
		Pictures:       make([]File, 0),
		Availabilities: make([]Availability, 0),
	}
}
