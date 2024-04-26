package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

func WithCustomer(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, err := utils.GetUserClaims(utils.TransformEchoContext(c))
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized)
		}

		if claims.Role != entities.RoleCustomer {
			return echo.NewHTTPError(http.StatusForbidden)
		}

		return next(c)
	}
}
