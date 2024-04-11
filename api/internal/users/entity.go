package users

type User struct {
	ID             int64
	EmailAddress   string
	PasswordHash   string
	PhoneNumber    string
	Name           string
	Active         bool
	ProfilePicture *string
	AccessToken    string
	RefreshToken   string
}
