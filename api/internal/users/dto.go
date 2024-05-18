package users

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type response struct {
	ID             int64   `json:"id,omitempty"`
	EmailAddress   string  `json:"emailAddress,omitempty"`
	PhoneNumber    string  `json:"phoneNumber,omitempty"`
	Name           string  `json:"name,omitempty"`
	Role           string  `json:"role,omitempty"`
	IsActive       bool    `json:"isActive,omitempty"`
	ProfilePicture *string `json:"profilePicture,omitempty"`
	AccessToken    string  `json:"accessToken,omitempty"`
	RefreshToken   string  `json:"refreshToken,omitempty"`

	Agent    *entities.AgencyAgent `json:"agent,omitempty"`
	Customer *customers.Customer   `json:"customer,omitempty"`
}

func newResponseFromEntity(user *entities.User) (response, error) {
	phoneNumber, err := entities.NewE164PhoneNumber(user.PhoneNumber.CountryCode, user.PhoneNumber.PhoneNumber)
	if err != nil {
		return response{}, err
	}

	var profilePicture string
	if user.ProfilePicture != nil {
		profilePicture, err = utils.GetFileURL(*user.ProfilePicture)
		if err != nil {
			return response{}, err
		}
	}

	res := response{
		ID:             user.ID,
		EmailAddress:   user.EmailAddress,
		PhoneNumber:    phoneNumber,
		Name:           user.Name,
		IsActive:       user.Active,
		ProfilePicture: &profilePicture,
		Role:           string(user.Role),
		Customer:       user.Customer,
		Agent:          user.Agent,
	}

	return res, nil
}
