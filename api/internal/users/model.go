package users

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/model"
)

type dbUser struct {
	User model.Users
}

func (u dbUser) ToEntity() User {
	return User{
		ID:             int64(u.User.ID),
		EmailAddress:   u.User.EmailAddress,
		PasswordHash:   u.User.PasswordHash,
		PhoneNumber:    u.User.PhoneNumber,
		Name:           u.User.Name,
		IsActive:       u.User.IsActive,
		ProfilePicture: u.User.ProfilePicture,
	}
}
