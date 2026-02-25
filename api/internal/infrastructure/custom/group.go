package custom

import (
	"github.com/labstack/echo/v4"
)

// custom.Group
type Group struct {
	eg *echo.Group
	Deps
}

func NewGroup(eg *echo.Group, deps Deps) (*Group, error) {
	if err := deps.ValidateDeps(); err != nil {
		return nil, err
	}
	return &Group{
		eg:   eg,
		Deps: deps,
	}, nil
}

func (cg *Group) GET(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	return cg.eg.GET(path, cg.Wrap(ch), cg.WrapMiddlewares(m)...)
}

func (cg *Group) POST(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	return cg.eg.POST(path, cg.Wrap(ch), cg.WrapMiddlewares(m)...)
}

func (cg *Group) PUT(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	return cg.eg.PUT(path, cg.Wrap(ch), cg.WrapMiddlewares(m)...)
}

func (cg *Group) DELETE(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	return cg.eg.DELETE(path, cg.Wrap(ch), cg.WrapMiddlewares(m)...)
}

func (cg *Group) PATCH(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	return cg.eg.PATCH(path, cg.Wrap(ch), cg.WrapMiddlewares(m)...)
}

func (cg *Group) Group(prefix string, m ...MiddlewareFunc) *Group {
	g, err := NewGroup(cg.eg.Group(prefix, cg.WrapMiddlewares(m)...), cg.Deps)
	if err != nil {
		panic(err)
	}
	return g
}

func (cg *Group) Use(middleware ...MiddlewareFunc) {
	for _, m := range middleware {
		cg.eg.Use(cg.WrapMiddleware(m))
	}
}
