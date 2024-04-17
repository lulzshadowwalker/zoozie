package entities

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

type PhoneNumber struct {
	CountryCode string
	PhoneNumber string
}

func NewCountryCode(countryCode string) (string, error) {
	countryCode = strings.Trim(countryCode, " ")
	if countryCode == "" {
		return "", errors.New("country code cannot be empty")
	}

	if len(countryCode) > 3 {
		return "", errors.New("country code cannot be longer than 3 digits")
	}

	if _, err := strconv.ParseInt(countryCode, 10, 64); err != nil {
		return "", fmt.Errorf("country code can only contain numbers (%w)", err)
	}

	return countryCode, nil
}

func validatePhoneNumber(phoneNumber string) error {
	if phoneNumber == "" {
		return errors.New("phone number cannot be empty")
	}

	// NOTE: order is important otherwise the strconv.ParseInt might fail on larger numbers
	if len(phoneNumber) > 12 {
		return errors.New("phone number cannot be longer than 12 digits")
	}

	if _, err := strconv.ParseInt(phoneNumber, 10, 64); err != nil {
		return fmt.Errorf("phone number can only contain numbers")
	}

	return nil
}

func NewPhoneNumber(countryCode, phoneNumber string) (PhoneNumber, error) {
	countryCode, err := NewCountryCode(countryCode)
	if err != nil {
		return PhoneNumber{}, err
	}

	if err := validatePhoneNumber(phoneNumber); err != nil {
		return PhoneNumber{}, err
	}

	return PhoneNumber{
		CountryCode: countryCode,
		PhoneNumber: phoneNumber,
	}, nil
}

// returns a valid e164 phone number (without the area code) [+][country code][--area code--][phone number]
func NewE164PhoneNumber(countryCode, phoneNumber string) (string, error) {
	countryCode, err := NewCountryCode(countryCode)
	if err != nil {
		return "", err
	}

	if err := validatePhoneNumber(phoneNumber); err != nil {
		return "", err
	}

	phoneNumber = strings.Trim(phoneNumber, " ")

	if !strings.HasPrefix(countryCode, "+") {
		countryCode = "+" + countryCode
	}

	phoneNumber = strings.TrimPrefix(phoneNumber, "0")

	return (countryCode + phoneNumber), nil
}
