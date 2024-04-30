package utils

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"path"
	"regexp"
	"strconv"
	"strings"

	"github.com/gabriel-vasile/mimetype"
	"github.com/go-jet/jet/qrm"
	qrmV2 "github.com/go-jet/jet/v2/qrm"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/lib/pq"
	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
)

type ContextKey string

const (
	ContextLocaleKey ContextKey = "locale"
	ContextUserKey   ContextKey = "user"
)

var (
	ErrNotCustomer = errors.New("user is not a customer")
	ErrNotAgent    = errors.New("user is not an agent")
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

type FileInfo struct {
	Path     string
	MimeType string
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

func GetUserID(c context.Context) (int, error) {
	u, ok := c.Value(ContextUserKey).(*jwt.Token)
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

func GetUserClaims(c context.Context) (entities.JwtCustomClaims, error) {
	u, ok := c.Value(ContextUserKey).(*jwt.Token)
	if !ok {
		return entities.JwtCustomClaims{}, errors.New("echo.Context.Get(\"user\") is not *jwt.Token")
	}

	if u == nil || !u.Valid {
		return entities.JwtCustomClaims{}, echo.NewHTTPError(http.StatusUnauthorized)
	}

	claims, ok := u.Claims.(*entities.JwtCustomClaims)
	if !ok {
		return entities.JwtCustomClaims{}, fmt.Errorf("echo.Context.Get(\"user\") claims is not *entities.JwtCustomClaims")
	}

	return *claims, nil
}

func GetAgencyID(c context.Context) (int, error) {
	claims, err := GetUserClaims(c)
	if err != nil {
		return -1, err
	}

	if role := claims.Role; role != entities.RoleAgencyAgent {
		return -1, ErrNotAgent
	}

	return claims.AgencyID, nil
}

func GetCustomerID(c context.Context) (int, error) {
	claims, err := GetUserClaims(c)
	if err != nil {
		return -1, err
	}

	if role := claims.Role; role != entities.RoleCustomer {
		return -1, ErrNotCustomer
	}

	return claims.CustomerID, nil
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

func BindAndValidate(c echo.Context, i interface{}) error {
	if err := c.Bind(i); err != nil {
		return err
	}

	if err := c.Validate(i); err != nil {
		return err
	}

	return nil
}

func IsUniquePostgresViolationErr(err error) bool {
	pgErr, ok := err.(*pq.Error)
	if !ok {
		// Not a PostgreSQL error
		return false
	}

	return pgErr.Code == "23505"
}

func IsForeignKeyPostgresViolationErr(err error) bool {
	pgErr, ok := err.(*pq.Error)
	return ok && pgErr.Code.Name() == "foreign_key_violation"
}

func GenerateSlug(s string) string {
	// Convert the string to lowercase
	s = strings.ToLower(s)

	// Replace spaces with hyphens
	s = strings.ReplaceAll(s, " ", "-")

	// Remove non-alphanumeric characters
	reg := regexp.MustCompile("[^a-zA-Z0-9-]+")
	s = reg.ReplaceAllString(s, "")

	// Remove consecutive hyphens
	s = strings.ReplaceAll(s, "--", "-")

	// Remove leading and trailing hyphens
	s = strings.Trim(s, "-")

	return s
}

// returns the destination file, the destination file path, and the error if any
func StoreFile(file *multipart.FileHeader) (FileInfo, error) {
	id := uuid.NewString()
	destPath := fmt.Sprintf("public/%s/%s/%s/", id[0:1], id[0:2], id[0:3])

	err := os.MkdirAll(destPath, os.ModePerm)
	if err != nil {
		return FileInfo{}, fmt.Errorf("failed to create directory because %w", err)
	}

	filepath := path.Join(destPath, id+path.Ext(file.Filename))
	dest, err := os.OpenFile(filepath, os.O_RDWR|os.O_CREATE, 0o666)
	if err != nil {
		return FileInfo{}, fmt.Errorf("failed to open file because %w", err)
	}
	defer dest.Close()

	source, err := file.Open()
	if err != nil {
		return FileInfo{}, fmt.Errorf("failed to open file because %w", err)
	}
	defer source.Close()

	_, err = io.Copy(dest, source)
	if err != nil {
		return FileInfo{}, fmt.Errorf("failed to copy file because %w", err)
	}

	buffer := make([]byte, 512)
	_, err = dest.Seek(0, 0)
	if err != nil {
		slog.Error("failed to seek to file origin", "err", err)
	}

	_, err = dest.Read(buffer)
	if err != nil {
		slog.Error("failed to detect mime type", "err", err)
	}

	mime := mimetype.Detect(buffer).String()

	info := FileInfo{
		Path:     filepath,
		MimeType: mime,
	}

	return info, nil
}

func GetFileURL(path string) (string, error) {
	sanitized := strings.TrimPrefix(path, "public/")
	url, err := url.JoinPath(config.GetAppUrl(), sanitized)
	if err != nil {
		return "", fmt.Errorf("failed to join path because %w", err)
	}
	return url, err
}
