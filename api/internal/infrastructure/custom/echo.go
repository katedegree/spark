package custom

import (
	"github.com/labstack/echo/v4"
)

// custom.Echo
type Echo struct {
	ee *echo.Echo
	Deps
	Validator echo.Validator
	Logger    echo.Logger
	// 外部で使うものがあれば追加していく
}

func NewEcho(deps Deps) (*Echo, error) {
	if err := deps.ValidateDeps(); err != nil {
		return nil, err
	}
	e := echo.New()
	e.Validator = NewValidator()
	return &Echo{
		ee:        e, // 外部からのアクセスを制限
		Deps:      deps,
		Validator: e.Validator,
		Logger:    e.Logger,
	}, nil
}

func (ce *Echo) Group(prefix string, m ...MiddlewareFunc) *Group {
	g, err := NewGroup(ce.ee.Group(prefix, ce.WrapMiddlewares(m)...), ce.Deps)
	if err != nil {
		panic(err)
	}
	return g
}

func (ce *Echo) Use(middleware ...MiddlewareFunc) {
	for _, m := range middleware {
		ce.ee.Use(ce.WrapMiddleware(m))
	}
}

func (ce *Echo) Start(address string) error {
	return ce.ee.Start(address)
}

func (ce *Echo) GET(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	return ce.ee.GET(path, ce.Wrap(h), ce.WrapMiddlewares(m)...)
}

func (ce *Echo) POST(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	return ce.ee.POST(path, ce.Wrap(h), ce.WrapMiddlewares(m)...)
}

func (ce *Echo) PUT(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	return ce.ee.PUT(path, ce.Wrap(h), ce.WrapMiddlewares(m)...)
}

func (ce *Echo) DELETE(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	return ce.ee.DELETE(path, ce.Wrap(h), ce.WrapMiddlewares(m)...)
}

func (ce *Echo) PATCH(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	return ce.ee.PATCH(path, ce.Wrap(h), ce.WrapMiddlewares(m)...)
}
