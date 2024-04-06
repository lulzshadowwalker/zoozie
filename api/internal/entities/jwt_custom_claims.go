package entities

import (
	"github.com/golang-jwt/jwt/v5"
)

type JwtCustomClaims struct {
	Name string `json:"name"`
	jwt.RegisteredClaims
}
