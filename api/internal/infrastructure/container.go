package infrastructure

import (
	"github.com/katedegree/spark/internal/infrastructure/middleware"
	"github.com/katedegree/spark/internal/infrastructure/repository"
	"go.uber.org/dig"
)

func NewContainer() *dig.Container {
	c := dig.New()

	// 各インスタンスの登録
	c.Provide(NewDB)      // Grom
	c.Provide(NewStorage) // S3
	c.Provide(NewMailer)  // SES
	c.Provide(NewAI)      // OpenAI

	// Repository
	c.Provide(repository.NewUserRepository)

	// Middleware
	c.Provide(middleware.NewMiddleware)

	return c
}
