package infrastructure

import (
	"github.com/katedegree/spark/internal/infrastructure/handler/v1/auth"
	"github.com/katedegree/spark/internal/infrastructure/middleware"
	"github.com/katedegree/spark/internal/infrastructure/repository"
	"github.com/katedegree/spark/internal/usecase"
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
	c.Provide(repository.NewEmailRepository)
	c.Provide(repository.NewOtpRepository)
	c.Provide(repository.NewUserRepository)

	// UseCase
	c.Provide(usecase.NewAuthSendOtpUsecase)

	// Handler
	c.Provide(auth.NewSendOtpHandler)

	// Middleware
	c.Provide(middleware.NewAuthMiddleware)
	c.Provide(middleware.NewContextMiddleware)
	c.Provide(middleware.NewCORSMiddleware)
	c.Provide(middleware.NewOptionalAuthMiddleware)
	c.Provide(middleware.NewRecoverMiddleware)

	return c
}
