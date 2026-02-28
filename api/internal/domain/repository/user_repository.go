package repository

import "github.com/katedegree/spark/internal/domain/entity"

type UserRepository interface {
	FindByEmail(email string) (*entity.User, error)
}
