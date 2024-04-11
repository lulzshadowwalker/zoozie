package users

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
)

type dbUser struct {
	User model.Users
}

func (u dbUser) ToEntity() User {
	user := User{
		ID:             int64(u.User.ID),
		EmailAddress:   u.User.EmailAddress,
		PhoneNumber:    u.User.PhoneNumber,
		Name:           u.User.Name,
		Active:         u.User.Active,
		ProfilePicture: u.User.ProfilePicture,
	}

	return user
}
