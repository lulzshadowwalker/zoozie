package users

type response struct {
	ID             int64   `json:"id,omitempty"`
	EmailAddress   string  `json:"emailAddress,omitempty"`
	PhoneNumber    *string `json:"phoneNumber,omitempty"`
	Name           *string `json:"name,omitempty"`
	IsActive       *bool   `json:"isActive,omitempty"`
	ProfilePicture *string `json:"profilePicture,omitempty"`
	AccessToken    string  `json:"accessToken,omitempty"`
	RefreshToken   string  `json:"refreshToken,omitempty"`
}

func newResponseFromEntity(user *User) *response {
	return &response{
		ID:             user.ID,
		EmailAddress:   user.EmailAddress,
		PhoneNumber:    user.PhoneNumber,
		Name:           user.Name,
		IsActive:       user.IsActive,
		ProfilePicture: user.ProfilePicture,
	}
}
