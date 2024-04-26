package entities

import (
	"github.com/golang-jwt/jwt/v5"
)

type JwtCustomClaims struct {
	Name       string `json:"name"`
	Role       Role   `json:"role"`
	AgencyID   int    `json:"agency_id,omitempty"`
	CustomerID int    `json:"customer_id,omitempty"`
	jwt.RegisteredClaims
}
