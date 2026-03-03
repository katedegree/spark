package repository

import (
	"context"

	"github.com/katedegree/spark/internal/domain/entity"
)

type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*entity.User, error)
}
