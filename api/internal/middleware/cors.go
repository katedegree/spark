package middleware

import (
	"github.com/katedegree/spark/internal/custom"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func CORS(next custom.HandlerFunc) custom.HandlerFunc {
	echoCORS := middleware.CORS()

	return func(cc *custom.Context) error {
		echoHandler := echoCORS(func(c echo.Context) error {
			return next(cc)
		})
		return echoHandler(cc.Context)
	}
}
