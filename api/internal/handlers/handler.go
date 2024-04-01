package handlers

import (
	"errors"
	"net/http"

	"github.com/go-jet/jet/v2/qrm"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type handler interface {
	RegisterRoutes(e *echo.Group)
}

type ZoozieValidator struct {
	validator *validator.Validate
}

func NewZoozieValidator() *ZoozieValidator {
	return &ZoozieValidator{
		validator: validator.New(),
	}
}

// validates input and returns an `*echo.HTTPError` with status `400 - Bad Request` if validation fails
func (cv *ZoozieValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return nil
}

type wrappedHandlerFunc func(c echo.Context) error

func unwrap(fn wrappedHandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if err := fn(c); err != nil {
			if err, ok := err.(*utils.ApiError); ok {
				return echo.NewHTTPError(err.Status, err.Message)
			}

			if errors.Is(err, qrm.ErrNoRows) {
				return echo.NewHTTPError(http.StatusNotFound)
			}

			return err
		}

		return nil
	}
}
