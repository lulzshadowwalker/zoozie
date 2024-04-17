package agencies

import "github.com/lulzshadowwalker/zoozie/api/internal/entities"

type Agency struct {
	ID           int                  `json:"id,omitempty"`
	PhoneNumber  entities.PhoneNumber `json:"phoneNumber,omitempty"`
	EmailAddress string               `json:"emailAddress,omitempty"`
	Logo         string               `json:"logo,omitempty"`
	Slug         string               `json:"slug,omitempty"`

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
