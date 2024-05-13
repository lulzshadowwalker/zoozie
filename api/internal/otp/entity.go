package otp

import "time"

type OTP struct {
	ID         int
	UserID     int
	Code       string
	SentAt     time.Time
	VerifiedAt *time.Time
}
