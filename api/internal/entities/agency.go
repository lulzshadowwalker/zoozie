package entities

import (
	"time"
)

type Agency struct {
	ID           int         `json:"id,omitempty"`
	EmailAddress string      `json:"emailAddress,omitempty"`
	PhoneNumber  PhoneNumber `json:"phoneNumber,omitempty"`
	Logo         string      `json:"logo,omitempty"`
	Slug         string      `json:"slug,omitempty"`

	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	Following   bool   `json:"following"`

	Rating       *float64 `json:"rating,omitempty"`
	ReviewsCount *int     `json:"reviewsCount,omitempty"`
}

type AgencyAgent struct {
	ID       int     `json:"id,omitempty"`
	UserID   int     `json:"userId,omitempty"`
	AgencyID int     `json:"agencyId,omitempty"`
	Agency   *Agency `json:"agency,omitempty"`
}

type AgencyI18n struct {
	AgencyID     int    `json:"agencyId,omitempty"`
	LanguageCode string `json:"languageCode,omitempty"`
	Name         string `json:"name,omitempty"`
	Description  string `json:"description,omitempty"`
}

type AgencyReview struct {
	ID         int        `json:"id,omitempty"`
	AgencyID   int        `json:"agencyId,omitempty"`
	CustomerID int        `json:"customerId,omitempty"`
	Customer   *User      `json:"customer,omitempty"`
	Content    string     `json:"content,omitempty"`
	Rating     int        `json:"rating,omitempty"`
	CreatedAt  *time.Time `json:"createdAt,omitempty"`
	UpdateAt   *time.Time `json:"updatedAt,omitempty"`
}

type AgencyStats struct {
	AgencyID           int     `json:"agencyId,omitempty"`
	AdminsCount        int     `json:"adminsCount"`
	ListingsCount      int     `json:"listingsCount"`
	ConversationsCount int     `json:"conversationsCount"`
	ReviewsCount       int     `json:"reviewsCount"`
	Rating             float64 `json:"rating"`
}
