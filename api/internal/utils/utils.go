package utils

import (
	"context"
	"errors"
	"strings"

	"github.com/labstack/echo/v4"
)

const ContextLocaleKey = "locale"

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
	return context.WithValue(ctx, ContextLocaleKey, c.Param("locale"))
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
