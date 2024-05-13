package entities

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
)

type User struct {
	ID             int64        `json:"id,omitempty"`
	Role           Role         `json:"role,omitempty"`
	EmailAddress   string       `json:"emailAddress,omitempty"`
	PhoneNumber    *PhoneNumber `json:"phoneNumber,omitempty"`
	Name           string       `json:"name,omitempty"`
	Active         bool         `json:"active,omitempty"`
	ProfilePicture *string      `json:"profilePicture,omitempty"`
	AccessToken    string       `json:"-"`
	RefreshToken   string       `json:"-"`

	Agent    *AgencyAgent        `json:"agent,omitempty"`
	Customer *customers.Customer `json:"customer,omitempty"`
}
