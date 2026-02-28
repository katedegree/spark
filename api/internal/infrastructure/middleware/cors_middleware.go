package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func corsMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		c.Response().Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Response().Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Response().Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")

		if c.Request().Method == http.MethodOptions {
			return c.NoContent(http.StatusNoContent)
		}

		return next(c)
	}
}
