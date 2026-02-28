package middleware

import (
	"github.com/katedegree/spark/internal/domain/repository"
	"github.com/labstack/echo/v4"
)

type Middleware struct {
	Auth         echo.MiddlewareFunc
	Context      echo.MiddlewareFunc
	CORS         echo.MiddlewareFunc
	OptionalAuth echo.MiddlewareFunc
	Recover      echo.MiddlewareFunc
}

func NewMiddleware(userRepo repository.UserRepository) Middleware {
	return Middleware{
		Auth:         authMiddleware(userRepo),
		Context:      contextMiddleware,
		CORS:         corsMiddleware,
		OptionalAuth: optionalAuthMiddleware(userRepo),
		Recover:      recoverMiddleware,
	}
}
