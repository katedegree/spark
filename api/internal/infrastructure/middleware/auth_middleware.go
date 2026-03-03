package middleware

import (
	"strings"

	domain "github.com/katedegree/spark/internal/domain/repository"
	"github.com/katedegree/spark/internal/infrastructure/custom"
	"github.com/katedegree/spark/pkg/jwt"
	"github.com/labstack/echo/v4"
)

type AuthMiddleware func(next echo.HandlerFunc) echo.HandlerFunc

// 認証ミドルウェア
func NewAuthMiddleware(userRepo domain.UserRepository) AuthMiddleware {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := c.(*custom.Context)
			authHeader := cc.Request().Header.Get("Authorization")
			if authHeader == "" {
				return cc.JSON(401, map[string]string{"error": "認証トークンが必要です"})
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString == authHeader {
				return cc.JSON(401, map[string]string{"error": "無効なトークン形式です"})
			}

			claims, err := jwt.Verify(tokenString)
			if err != nil {
				return cc.JSON(401, map[string]string{"error": "無効なトークン形式です"})
			}

			user, err := userRepo.FindByEmail(cc.Request().Context(), claims.Email)
			if err != nil || user.ID != claims.AuthID {
				return cc.JSON(401, map[string]string{"error": "無効なトークン形式です"})
			}

			cc.Auth = user
			return next(cc)
		}
	}
}
