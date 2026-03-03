package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/katedegree/spark/internal/infrastructure"
	"github.com/katedegree/spark/internal/infrastructure/custom"
	"github.com/katedegree/spark/internal/infrastructure/middleware"
	"github.com/katedegree/spark/internal/infrastructure/router"
	"github.com/labstack/echo/v4"
)

func main() {
	_ = godotenv.Load()

	c := infrastructure.NewContainer()

	if err := c.Invoke(func(
		corsMiddleware middleware.CORSMiddleware,
		recoverMiddleware middleware.RecoverMiddleware,
		contextMiddleware middleware.ContextMiddleware,
	) {
		e := echo.New()
		e.Validator = custom.NewValidator()

		// ミドルウェアの登録
		e.Use(echo.MiddlewareFunc(corsMiddleware))
		e.Use(echo.MiddlewareFunc(recoverMiddleware))
		e.Use(echo.MiddlewareFunc(contextMiddleware))

		router.V1(e.Group("/v1"))

		e.Logger.Fatal(e.Start(":8080"))
	}); err != nil {
		log.Fatal(err)
	}
}
