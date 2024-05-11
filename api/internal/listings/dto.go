package listings

type (
	requestExtraFeature struct {
		TitleEnglish string `json:"titleEnglish" form:"titleEnglish" validate:"required"`
		TitleArabic  string `json:"titleArabic" form:"titleArabic" validate:"required"`
		Exists       bool   `json:"exists" form:"exists" validate:"boolean"`
	}

	requestPrice struct {
		Currency string  `json:"currency" form:"currency" validate:"required,oneof=JOD USD"`
		Amount   float64 `json:"amount" form:"amount" validate:"required,number,gt=0"`
	}

	requestAvailability struct {
		Availability string       `json:"availability" form:"availability" validate:"required,oneof=RENT SALE"`
		Price        requestPrice `json:"price" form:"price" validate:"required"`
	}

	requestPicture struct {
		URL   string `json:"url" form:"url" validate:"required,url"`
		Title string `json:"title" form:"title"`
	}

	requestLocation struct {
		CountryID int `json:"countryId" form:"countryId" validate:"required,number"`
		CityID    int `json:"cityId" form:"cityId" validate:"required,number"`
		AreaID    int `json:"areaId" form:"areaId" validate:"required,number"`
	}

	createListingRequest struct {
		Type     string          `json:"type" form:"type" validate:"required,oneof=PROPERTY COMMERCIAL_PROPERTY OFFICE_SPACE RETAIL_SPACE INDUSTRIAL_SPACE MIXED_USE_PROPERTY RESIDENTIAL_PROPERTY APARTMENT VILLA TOWNHOUSE CONDOMINIUM"`
		Location requestLocation `json:"location" form:"location" validate:"required"`

		DescriptionEnglish string `json:"descriptionEnglish" form:"descriptionEnglish" validate:"required"`
		DescriptionArabic  string `json:"descriptionArabic" form:"descriptionArabic" validate:"required"`

		Bedrooms                   int    `json:"bedrooms" form:"bedrooms" validate:"required,number,gte=0"`
		BedroomsDescriptionEnglish string `json:"bedroomsDescriptionEnglish" form:"bedroomsDescriptionEnglish" validate:"required"`
		BedroomsDescriptionArabic  string `json:"bedroomsDescriptionArabic" form:"bedroomsDescriptionArabic" validate:"required"`

		Bathrooms                   int    `json:"bathrooms" form:"bathrooms" validate:"required,number,gte=0"`
		BathroomsDescriptionEnglish string `json:"bathroomsDescriptionEnglish" form:"bathroomsDescriptionEnglish" validate:"required"`
		BathroomsDescriptionArabic  string `json:"bathroomsDescriptionArabic" form:"bathroomsDescriptionArabic" validate:"required"`

		YearBuilt                   int    `json:"yearBuilt" form:"yearBuilt" validate:"required,number,min=1900,max=2030"`
		YearBuiltDescriptionEnglish string `json:"yearBuiltDescriptionEnglish" form:"yearBuiltDescriptionEnglish" validate:"required"`
		YearBuiltDescriptionArabic  string `json:"yearBuiltDescriptionArabic" form:"yearBuiltDescriptionArabic" validate:"required"`

		Area                   float64 `json:"area" form:"area" validate:"required,number,gte=0"`
		AreaDescriptionEnglish string  `json:"areaDescriptionEnglish" form:"areaDescriptionEnglish" validate:"required"`
		AreaDescriptionArabic  string  `json:"areaDescriptionArabic" form:"areaDescriptionArabic" validate:"required"`

		Furnished                   bool   `json:"furnished" form:"furnished" validate:"boolean"`
		FurnishedDescriptionEnglish string `json:"furnishedDescriptionEnglish" form:"furnishedDescriptionEnglish" validate:"required"`
		FurnishedDescriptionArabic  string `json:"furnishedDescriptionArabic" form:"furnishedDescriptionArabic" validate:"required"`

		ExtraFeatures  []requestExtraFeature `json:"extraFeatures" form:"extraFeatures" validate:"dive,required"`
		Availabilities []requestAvailability `json:"availabilities" form:"availabilities" validate:"dive,required"`
		Pictures       []requestPicture      `json:"pictures" form:"pictures" validate:"dive,required"`
	}
)

type getListingsRequest struct {
	Furnished      *bool    `query:"furnished" validate:"omitempty,boolean"`
	MinArea        int      `query:"minArea" validate:"omitempty,number"`
	MinYearBuilt   int      `query:"minYear" validate:"omitempty,number"`
	MinBathrooms   int      `query:"minBathrooms" validate:"omitempty,number"`
	MinBedrooms    int      `query:"minBedrooms" validate:"omitempty,number"`
	Type           string   `query:"type" validate:"omitempty,oneof=PROPERTY COMMERCIAL_PROPERTY OFFICE_SPACE RETAIL_SPACE INDUSTRIAL_SPACE MIXED_USE_PROPERTY RESIDENTIAL_PROPERTY APARTMENT VILLA TOWNHOUSE CONDOMINIUM"`
	Locations      []int    `query:"locations" validate:"omitempty,dive,number"`
	MinRentPrice   int      `query:"minRentPrice" validate:"omitempty,number"`
	MaxRentPrice   int      `query:"maxRentPrice" validate:"omitempty,number"`
	MinSalePrice   int      `query:"minSalePrice" validate:"omitempty,number"`
	MaxSalePrice   int      `query:"maxSalePrice" validate:"omitempty,number"`
	Availabilities []string `query:"availability" validate:"omitempty,dive,oneof=RENT SALE"`
}

func (r getListingsRequest) toFilters() filters {
	return filters(r)
}

type getListingRequest struct {
	ID     int      `param:"id" validate:"required,number"`
	Expand []string `query:"expand"`
}

type toggleListingFavoriteRequest struct {
	ListingID int `param:"id" validate:"required,number"`
}
