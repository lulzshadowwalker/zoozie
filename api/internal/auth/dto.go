package auth

import "mime/multipart"

type registerCustomerRequest struct {
	Name        string `json:"name" form:"name" validate:"required"`
	CountryCode string `json:"countryCode" form:"countryCode" validate:"required,number,min=1,max=3"`
	PhoneNumber string `json:"phoneNumber" form:"phoneNumber" validate:"required,number,max=12"`

	EmailAddress   string `json:"emailAddress,omitempty" form:"emailAddress" validate:"omitempty,email"`
	ProfilePicture *multipart.FileHeader
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

	// required if the access token is absent
	CountryCode string `json:"countryCode" form:"countryCode" validate:"required_with=PhoneNumber,len=0|number,len=0|min=1,len=0|max=3"`
	PhoneNumber string `json:"phoneNumber" form:"phoneNumber" validate:"required_with=CountryCode,len=0|number,len=0|max=12"`
}

type sendOTPRequest struct {
	// required if the access token is absent
	CountryCode string `json:"countryCode" form:"countryCode" validate:"required_with=PhoneNumber,len=0|number,len=0|min=1,len=0|max=3"`
	PhoneNumber string `json:"phoneNumber" form:"phoneNumber" validate:"required_with=CountryCode,len=0|number,len=0|max=12"`
}

type loginRequest struct {
	OTP         string `json:"otp" form:"otp" validate:"required"`
	CountryCode string `json:"countryCode" form:"countryCode" validate:"required,number,min=1,max=3"`
	PhoneNumber string `json:"phoneNumber" form:"phoneNumber" validate:"required,number,max=12"`
}
