package entities

import (
	"time"
)

type Agency struct {
	ID           int         `json:"id,omitempty"`
	PhoneNumber  PhoneNumber `json:"phoneNumber,omitempty"`
	EmailAddress string      `json:"emailAddress,omitempty"`
	Logo         string      `json:"logo,omitempty"`
	Slug         string      `json:"slug,omitempty"`

	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
}

type AgencyAgent struct {
	ID       int `json:"id,omitempty"`
	UserID   int `json:"userId,omitempty"`
	AgencyID int `json:"agencyId,omitempty"`
}

type AgencyI18n struct {
	AgencyID     int    `json:"agencyId,omitempty"`
	LanguageCode string `json:"languageCode,omitempty"`
	Name         string `json:"name,omitempty"`
	Description  string `json:"description,omitempty"`
}

type AgencyReview struct {
	ID         int       `json:"id,omitempty"`
	AgencyID   int       `json:"agencyId,omitempty"`
	CustomerID int       `json:"customerId,omitempty"`
	Customer   *User     `json:"customer,omitempty"`
	Content    string    `json:"content,omitempty"`
	Rating     int       `json:"rating,omitempty"`
	CreatedAt  time.Time `json:"createdAt,omitempty"`
	UpdateAt   time.Time `json:"updatedAt,omitempty"`
}
