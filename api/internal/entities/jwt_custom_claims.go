package entities

import (
	"github.com/golang-jwt/jwt/v5"
)

type JwtCustomClaims struct {
	Name       string `json:"name"`
	Role       Role   `json:"role"`
	AgencyID   int    `json:"agencyId,omitempty"`
	AgencySlug string `json:"agencySlug,omitempty"`
	CustomerID int    `json:"customerId,omitempty"`
	jwt.RegisteredClaims
}
