package repository

import "context"

type EmailRepository interface {
	SendOTP(ctx context.Context, email, otp string) error
}
