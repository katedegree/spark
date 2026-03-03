package repository

import (
	"context"
	"time"

	"github.com/katedegree/spark/internal/domain/entity"
	"github.com/katedegree/spark/internal/domain/repository"
	"gorm.io/gorm"
)

type otpRepository struct {
	db *gorm.DB
}

func NewOtpRepository(db *gorm.DB) repository.OtpRepository {
	return &otpRepository{db: db}
}

func (r *otpRepository) Create(ctx context.Context, email, hashedOTP string) error {
	return r.db.WithContext(ctx).Create(&entity.Otp{
		Email:        email,
		OTP:          hashedOTP,
		AttemptCount: 0,
		ExpiresAt:    time.Now().Add(60 * time.Second),
	}).Error
}

func (r *otpRepository) DeleteByEmail(ctx context.Context, email string) error {
	return r.db.WithContext(ctx).Where("email = ?", email).Delete(&entity.Otp{}).Error
}
