package middleware

import (
	"net/http"

	"github.com/katedegree/spark/internal/infrastructure/custom"
	"github.com/labstack/echo/v4"
)

func recoverMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		defer func() {
			if r := recover(); r != nil {
				// custom.Panicの場合は何もしない（レスポンス送信済み）
				if _, ok := r.(custom.Panic); ok {
					return
				}

				// その他のpanicは500エラー
				c.Logger().Error("panic: ", r)
				c.NoContent(http.StatusInternalServerError)
			}
		}()
		return next(c)
	}
}
