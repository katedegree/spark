package entity

import "time"

type User struct {
	ID              uint
	Email           string
	Password        string
	EmailVerifiedAt *time.Time
}
