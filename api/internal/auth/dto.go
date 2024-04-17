package auth

type registerCustomerRequest struct {
	Name           string `json:"name" form:"name" validate:"required"`
	EmailAddress   string `json:"email_address,omitempty" form:"email_address" validate:"omitempty,email"`
	CountryCode    string `json:"country_code" form:"country_code" validate:"required,number,min=1,max=3"`
	PhoneNumber    string `json:"phone_number" form:"phone_number" validate:"required,number,max=12"`
	ProfilePicture string `json:"profile_picture,omitempty" form:"profile_picture" validate:"omitempty,url"`
}

type registerAgencyAgentRequest struct {
	Name           string `json:"name" form:"name" validate:"required"`
	AgencyID       int    `json:"agencyId" form:"agencyId" validate:"required,number"`
	EmailAddress   string `json:"emailAddress,omitempty" form:"emailAddress" validate:"omitempty,email"`
	CountryCode    string `json:"countryCode" form:"countryCode" validate:"required,number,min=1,max=3"`
	PhoneNumber    string `json:"phoneNumber" form:"phoneNumber" validate:"required,number,max=12"`
	ProfilePicture string `json:"profilePicture,omitempty" form:"profilePicture" validate:"omitempty,url"`
}

type verifyOTPRequest struct {
	OTP string `json:"otp" form:"otp" validate:"required"`
}

type loginRequest struct {
	OTP         string `json:"otp" form:"otp" validate:"required"`
	CountryCode string `json:"country_code" form:"country_code" validate:"required,number,min=1,max=3"`
	PhoneNumber string `json:"phone_number" form:"phone_number" validate:"required,number,max=12"`
}
