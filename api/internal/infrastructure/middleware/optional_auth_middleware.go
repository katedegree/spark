package middleware

import (
	"strings"

	domain "github.com/katedegree/spark/internal/domain/repository"
	"github.com/katedegree/spark/internal/infrastructure/custom"
	"github.com/katedegree/spark/pkg/jwt"
	"github.com/labstack/echo/v4"
)

type OptionalAuthMiddleware func(next echo.HandlerFunc) echo.HandlerFunc

func NewOptionalAuthMiddleware(userRepo domain.UserRepository) OptionalAuthMiddleware {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := c.(*custom.Context)
			authHeader := cc.Request().Header.Get("Authorization")
			if authHeader == "" {
				return next(cc)
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString == authHeader {
				return next(cc)
			}

			claims, err := jwt.Verify(tokenString)
			if err != nil {
				return next(cc)
			}

			user, err := userRepo.FindByEmail(claims.Email)
			if err != nil || user.ID != claims.AuthID {
				return next(cc)
			}

			cc.Auth = user
			return next(cc)
		}
	}
}
