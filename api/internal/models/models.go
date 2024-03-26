package models

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/model"
)

type Agency struct {
	model.Agencies
	model.AgenciesI18n
}

type User struct {
	model.Users
	AccessToken  string `json:"accessToken,omitempty"`
	RefreshToken string `json:"refreshToken,omitempty"`
}

type CoreFeature struct {
	model.CoreFeatures
	model.CoreFeaturesI18n
}
