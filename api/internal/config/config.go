package config

import (
	"errors"
	"flag"
	"fmt"
	"os"
	"strconv"

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
		panic(fmt.Errorf("failed to initialize config because %s", err))
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

func GetDatabasePort() (int, error) {
	str := os.Getenv("DB_PORT")
	if str == "" {
		return -1, ErrNoValue
	}

	return strconv.Atoi(str)
}

func GetDatabasePassword() string {
	return os.Getenv("DB_PASSWORD")
}

func GetDatabaseName() string {
	return os.Getenv("DB_NAME")
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
