package repository

import "context"

type OtpRepository interface {
	Create(ctx context.Context, email, hashedOTP string) error
	DeleteByEmail(ctx context.Context, email string) error
}
