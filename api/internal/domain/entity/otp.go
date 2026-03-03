package entity

import "time"

type Otp struct {
	ID           uint
	Email        string
	OTP          string
	AttemptCount uint
	ExpiresAt    time.Time
}
