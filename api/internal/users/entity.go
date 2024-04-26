package users

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
)

type User struct {
	ID             int64
	Role           entities.Role
	EmailAddress   string
	PhoneNumber    entities.PhoneNumber
	Name           string
	Active         bool
	ProfilePicture *string
	AccessToken    string
	RefreshToken   string

	Agent    *agencies.AgencyAgent
	Customer *customers.Customer
}
