package models

import (
	"github.com/lulzshadowwalker/zooz/api/internal/database/.gen/zooz/public/model"
)

type (
	Agency struct {
		model.Agencies
		model.AgenciesI18n
	}

	User struct {
		model.Users
		AccessToken  string `json:"accessToken,omitempty"`
		RefreshToken string `json:"refreshToken,omitempty"`
	}
)
