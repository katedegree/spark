package auth

import (
	"errors"
	"net/http"

	"github.com/katedegree/spark/internal/infrastructure/custom"
	v1 "github.com/katedegree/spark/internal/infrastructure/handler/v1"
	"github.com/katedegree/spark/internal/usecase"
	"github.com/labstack/echo/v4"
)

type sendOtpHandler struct {
	sendOtp usecase.AuthSendOtpUsecase
}

func NewSendOtpHandler(sendOtp usecase.AuthSendOtpUsecase) sendOtpHandler {
	return sendOtpHandler{sendOtp: sendOtp}
}

func (h sendOtpHandler) Handle(ec echo.Context) error {
	cc := ec.(*custom.Context)
	req := v1.AuthSendOtpJSONBody{}
	cc.BindValidate(&req, nil)

	ctx := cc.Request().Context()
	err := h.sendOtp.Execute(ctx, string(req.Email))
	if err != nil {
		if errors.Is(err, usecase.ErrUserNotFound) {
			return cc.NoContent(http.StatusNotFound)
		}
		return cc.NoContent(http.StatusInternalServerError)
	}

	return cc.NoContent(http.StatusNoContent)
}
