package agencies

type getAgencyBySlugRequest struct {
	Slug string `query:"slug"`
}

type createAgencyRequest struct {
	EnglishName        string `json:"englishName" form:"englishName" validate:"required"`
	ArabicName         string `json:"arabicName" form:"arabicName" validate:"required"`
	EnglishDescription string `json:"englishDescription" form:"englishDescription" validate:"required"`
	ArabicDescription  string `json:"arabicDescription" form:"arabicDescription" validate:"required"`

	CountryCode string `json:"countryCode" form:"countryCode" validate:"required,number,min=1,max=3"`
	PhoneNumber string `json:"phoneNumber" form:"phoneNumber" validate:"required,number,max=12"`

	EmailAddress string `json:"emailAddress" form:"emailAddress" validate:"required,email"`
	Logo         string `json:"logo" form:"logo" validate:"required,url"`
}

type getAgencyReviewsRequest struct {
	ID int `param:"id" validate:"required,number"`
}

type createAgencyReviewRequest struct {
	AgencyID int    `param:"id" validate:"required,number"`
	Content  string `json:"content" form:"content"`
	Rating   int    `json:"rating" form:"rating" validate:"required,number,gte=1,lte=5"`
}

type toggleAgencyFollowRequest struct {
	AgencyID int `param:"id" validate:"required,number"`
}
