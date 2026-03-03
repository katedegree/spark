package model

import (
	"time"

	"github.com/katedegree/spark/internal/domain/entity"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email           string
	Password        string
	EmailVerifiedAt *time.Time
}

func (u *User) ToEntity() *entity.User {
	return &entity.User{
		ID:              u.ID,
		Email:           u.Email,
		Password:        u.Password,
		EmailVerifiedAt: u.EmailVerifiedAt,
	}
}
