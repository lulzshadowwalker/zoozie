package users

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
)

type DBUser struct {
	User         model.Users
	PhoneNumbers model.UserPhoneNumbers
	Role         model.UserRoles
	Agent        agencies.DBAgencyAgent
}

func (u DBUser) ToEntity() User {
	phoneNumber := entities.PhoneNumber{
		CountryCode: u.PhoneNumbers.CountryCode,
		PhoneNumber: u.PhoneNumbers.PhoneNumber,
	}

	user := User{
		ID:             int64(u.User.ID),
		Role:           entities.Role(u.Role.Name),
		EmailAddress:   u.User.EmailAddress,
		PhoneNumber:    &phoneNumber,
		Name:           u.User.Name,
		Active:         u.User.Active,
		ProfilePicture: u.User.ProfilePicture,
	}

	if u.Agent.AgencyAgent.ID != 0 {
		agent := u.Agent.ToEntity()
		user.Agent = &agent
	}

	return user
}
