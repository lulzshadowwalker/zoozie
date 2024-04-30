package users

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
)

type User struct {
	ID             int64                 `json:"id,omitempty"`
	Role           entities.Role         `json:"role,omitempty"`
	EmailAddress   string                `json:"emailAddress,omitempty"`
	PhoneNumber    *entities.PhoneNumber `json:"phoneNumber,omitempty"`
	Name           string                `json:"name,omitempty"`
	Active         bool                  `json:"active,omitempty"`
	ProfilePicture *string               `json:"profilePicture,omitempty"`
	AccessToken    string                `json:"-"`
	RefreshToken   string                `json:"-"`

	Agent    *agencies.AgencyAgent `json:"agent,omitempty"`
	Customer *customers.Customer   `json:"customer,omitempty"`
}
