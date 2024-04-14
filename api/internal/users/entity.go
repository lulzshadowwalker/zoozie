package users

import "github.com/lulzshadowwalker/zoozie/api/internal/entities"

type User struct {
	ID             int64
	Role           string
	EmailAddress   string
	PhoneNumber    entities.PhoneNumber
	Name           string
	Active         bool
	ProfilePicture *string
	AccessToken    string
	RefreshToken   string
}
