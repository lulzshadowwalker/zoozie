package agencies

type Agency struct {
	ID           int    `json:"id,omitempty"`
	PhoneNumber  string `json:"phoneNumber,omitempty"`
	EmailAddress string `json:"emailAddress,omitempty"`
	Slug         string `json:"slug,omitempty"`
	Name         string `json:"name,omitempty"`
	Description  string `json:"description,omitempty"`
	Logo         string `json:"logo"`
}

type AgencyAgent struct {
	ID       int `json:"id,omitempty"`
	UserID   int `json:"userId,omitempty"`
	AgencyID int `json:"agencyId,omitempty"`
}
