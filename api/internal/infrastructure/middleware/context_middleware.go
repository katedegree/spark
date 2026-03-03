package middleware

import (
	"github.com/katedegree/spark/internal/infrastructure/custom"
	"github.com/labstack/echo/v4"
)

type ContextMiddleware func(next echo.HandlerFunc) echo.HandlerFunc

func NewContextMiddleware() ContextMiddleware {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &custom.Context{Context: c}
			return next(cc)
		}
	}
}
