package config

import (
	"errors"
	"flag"
	"fmt"
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

var (
	port = flag.Int("port", 42069, "the port the server listens on")

	ErrNoValue = errors.New("config entry has no value")
)

func init() {
	dir, err := os.Getwd()
	if err != nil {
		panic(fmt.Errorf("failed to get the current working directory to initialize the config because %w", err))
	}

	err = godotenv.Load(dir + "/.env.local")
	if err != nil {
		slog.Warn("failed to load config file", "err", err, "file", ".env.local")
	}

	flag.Parse()
}

func GetPort() int {
	return *port
}

func GetDatabaseHost() string {
	return os.Getenv("DB_HOST")
}

func GetDatabaseUsername() string {
	return os.Getenv("DB_USERNAME")
}

func GetDatabasePort() (string, error) {
	str := os.Getenv("DB_PORT")
	if str == "" {
		return "", ErrNoValue
	}

	return str, nil
}

func GetDatabasePassword() string {
	return os.Getenv("DB_PASSWORD")
}

func GetDatabaseName() string {
	return os.Getenv("DB_NAME")
}

// GetDatabaseSSLMode returns the SSL mode for the database connection.
// If the environment variable is not set, it defaults to "disable".
func GetDatabaseSSLMode() string {
	val := os.Getenv("DB_SSL_MODE")
	if val == "" {
		return "disable"
	}

	return val
}

func GetSupportedLocales() []string {
	return []string{"en", "ar"}
}

func GetJwtSecret() string {
	return os.Getenv("JWT_SECRET")
}

func GetAppUrl() string {
	return os.Getenv("APP_URL")
}

func TwilioGetAccountSID() string {
	return os.Getenv("TWILIO_ACCOUNT_SID")
}

func TwilioGetAuthToken() string {
	return os.Getenv("TWILIO_AUTH_TOKEN")
}

func TwilioGetSourcePhoneNumber() string {
	return os.Getenv("TWILIO_FROM_PHONE_NUMBER")
}
