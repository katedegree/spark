package usecase

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"

	domain "github.com/katedegree/spark/internal/domain/repository"
	"github.com/katedegree/spark/pkg/hash"
	"gorm.io/gorm"
)

var ErrUserNotFound = errors.New("user not found")

type AuthSendOtpUsecase struct {
	userRepo  domain.UserRepository
	otpRepo   domain.OtpRepository
	emailRepo domain.EmailRepository
}

func NewAuthSendOtpUsecase(userRepo domain.UserRepository, otpRepo domain.OtpRepository, emailRepo domain.EmailRepository) AuthSendOtpUsecase {
	return AuthSendOtpUsecase{userRepo: userRepo, otpRepo: otpRepo, emailRepo: emailRepo}
}

func (u AuthSendOtpUsecase) Execute(ctx context.Context, email string) error {
	// PHASE: すでに登録されているユーザーか確認（email_verified_at != null）
	user, err := u.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrUserNotFound
		}
		return err
	}
	if user.EmailVerifiedAt == nil {
		return ErrUserNotFound
	}

	// PHASE: OTP を発行
	n, err := rand.Int(rand.Reader, big.NewInt(1000000))
	if err != nil {
		return err
	}
	otp := fmt.Sprintf("%06d", n.Int64())

	// PHASE: 古い OTP を削除
	if err := u.otpRepo.DeleteByEmail(ctx, email); err != nil {
		return err
	}

	// PHASE: OTP を保存
	hashedOTP, err := hash.Make(otp)
	if err != nil {
		return err
	}
	if err := u.otpRepo.Create(ctx, email, hashedOTP); err != nil {
		return err
	}

	// PHASE: OTP をメール送信
	if err := u.emailRepo.SendOTP(ctx, email, otp); err != nil {
		return err
	}

	return nil
}
