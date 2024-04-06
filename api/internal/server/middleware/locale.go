package middleware

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

func Locale(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		locale := c.Param("locale")
		if !utils.EqualsAny(locale, config.GetSupportedLocales()...) {
			return echo.NewHTTPError(http.StatusNotFound, fmt.Sprintf("locale %q is not supported", locale))
		}

		return next(c)
	}
}
