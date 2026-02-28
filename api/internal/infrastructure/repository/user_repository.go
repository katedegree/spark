package repository

import (
	"github.com/katedegree/spark/internal/domain/entity"
	domain "github.com/katedegree/spark/internal/domain/repository"
	"github.com/katedegree/spark/internal/infrastructure/model"
	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) domain.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) FindByEmail(email string) (*entity.User, error) {
	var m model.User
	err := r.db.Where("email = ?", email).First(&m).Error
	if err != nil {
		return nil, err
	}
	return m.ToEntity(), nil
}
