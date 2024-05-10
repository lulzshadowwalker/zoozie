package middleware

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
)

func Auth() echo.MiddlewareFunc {
	jwtConfig := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(entities.JwtCustomClaims)
		},
		SigningKey:  []byte(config.GetJwtSecret()),
		TokenLookup: "header:Authorization:Bearer ,query:token",
	}

	return echojwt.WithConfig(jwtConfig)
}

// PreferAuth is used for APIs that can operate on both unauthenticated and authenticated users
// it allows requests with missing tokens to pass but not malformed ones
func PreferAuth() echo.MiddlewareFunc {
	jwtConfig := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(entities.JwtCustomClaims)
		},
		SigningKey: []byte(config.GetJwtSecret()),
		ErrorHandler: func(c echo.Context, err error) error {
			if errors.Is(err, echojwt.ErrJWTMissing) {
				return nil
			}

			return err
		},
		ContinueOnIgnoredError: true,
	}

	return echojwt.WithConfig(jwtConfig)
}
