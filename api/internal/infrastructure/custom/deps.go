package custom

import (
	"errors"

	"github.com/labstack/echo/v4"
)

// Echo と Group の共通依存
type Deps struct {
	DB      *Gorm
	Storage *S3
	Mailer  *SES
	AI      *AI
	AuthID  uint
}

func (d *Deps) ValidateDeps() error {
	if d.DB == nil {
		return errors.New("DB is required")
	}
	if d.Storage == nil {
		return errors.New("Storage is required")
	}
	if d.Mailer == nil {
		return errors.New("Mailer is required")
	}
	if d.AI == nil {
		return errors.New("AI is required")
	}
	return nil
}

func (d *Deps) Wrap(ch HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		return ch(newContext(c, *d))
	}
}

func (d *Deps) WrapMiddleware(cm MiddlewareFunc) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := newContext(c, *d)
			customNext := func(ctx *Context) error {
				return next(ctx)
			}
			return cm(customNext)(cc)
		}
	}
}

func (d *Deps) WrapMiddlewares(m []MiddlewareFunc) []echo.MiddlewareFunc {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = d.WrapMiddleware(middleware)
	}
	return echoMiddlewares
}
