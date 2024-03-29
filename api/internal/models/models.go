package models

import (
	"github.com/golang-jwt/jwt/v5"
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

type Listing struct {
	Urls []string
}

type Upload = model.Uploads

type JwtCustomClaims struct {
	Name string `json:"name"`
	jwt.RegisteredClaims
}
