package repository

import (
	"context"

	"github.com/katedegree/spark/internal/domain/entity"
	"github.com/katedegree/spark/internal/domain/repository"
	"github.com/katedegree/spark/internal/infrastructure/model"
	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) repository.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	var m model.User
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&m).Error
	if err != nil {
		return nil, err
	}
	return m.ToEntity(), nil
}
