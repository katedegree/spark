package model

import (
	"github.com/katedegree/spark/internal/domain/entity"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string
	Password string
}

func (u *User) ToEntity() *entity.User {
	return &entity.User{
		ID:       u.ID,
		Email:    u.Email,
		Password: u.Password,
	}
}
