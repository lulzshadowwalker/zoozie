package utils

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-jet/jet/qrm"
	qrmV2 "github.com/go-jet/jet/v2/qrm"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
)

const (
	ContextLocaleKey = "locale"
	ContextUserKey   = "user"
)

type ApiError struct {
	Status  int
	Message string
}

func (e *ApiError) Error() string {
	return e.Message
}

func NewApiError(status int, message string) error {
	return &ApiError{status, message}
}

// GetLocale extracts the locale value from the given context.
//
// The locale value is expected to be a string and is stored in the context
// under the key "locale".
//
// If the locale value is missing or not a string, an error is returned.
func GetLocale(c context.Context) (string, error) {
	value, ok := c.Value(ContextLocaleKey).(string)

	if !ok || value == "" {
		return "", errors.New("locale value is missing or not a string in the given context")
	}

	return value, nil
}

func TransformEchoContext(c echo.Context) context.Context {
	ctx := context.Background()
	ctx = context.WithValue(ctx, ContextLocaleKey, c.Param("locale"))
	ctx = context.WithValue(ctx, ContextUserKey, c.Get("user"))

	return ctx
}

func EqualsAny(haystack string, needles ...string) bool {
	for _, needle := range needles {
		if haystack == needle {
			return true
		}
	}

	return false
}

func ContainsAny(haystack string, needles ...string) bool {
	for _, needle := range needles {
		if strings.Contains(haystack, needle) {
			return true
		}
	}

	return false
}

func GetUser(c context.Context) (int, error) {
	u, ok := c.Value("user").(*jwt.Token)
	if !ok {
		return -1, errors.New("echo.Context.Get(\"user\") is not *jwt.Token")
	}

	if u == nil || !u.Valid {
		return -1, echo.NewHTTPError(http.StatusUnauthorized)
	}

	claims := u.Claims.(*entities.JwtCustomClaims)
	uidString := claims.Subject
	uid, err := strconv.Atoi(uidString)
	if err != nil {
		return -1, fmt.Errorf("failed to parse the user id because %w", err)
	}

	return uid, nil
}

type wrappedHandlerFunc func(c echo.Context) error

func Unwrap(fn wrappedHandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if err := fn(c); err != nil {
			if errors.Is(err, qrm.ErrNoRows) || errors.Is(err, qrmV2.ErrNoRows) {
				return echo.NewHTTPError(http.StatusNotFound)
			}

			if err, ok := err.(*ApiError); ok {
				return echo.NewHTTPError(err.Status, err.Message)
			}

			return err
		}

		return nil
	}
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
