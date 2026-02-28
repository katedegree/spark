package middleware

import (
	"net/http"

	"github.com/katedegree/spark/internal/infrastructure/custom"
	"github.com/labstack/echo/v4"
)

type RecoverMiddleware func(next echo.HandlerFunc) echo.HandlerFunc

func NewRecoverMiddleware() RecoverMiddleware {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			defer func() {
				if r := recover(); r != nil {
					if _, ok := r.(custom.Panic); ok {
						return
					}
					c.Logger().Error("panic: ", r)
					c.NoContent(http.StatusInternalServerError)
				}
			}()
			return next(c)
		}
	}
}
