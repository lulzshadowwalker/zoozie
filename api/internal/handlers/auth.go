package handlers

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zooz/api/internal/models"
	"github.com/lulzshadowwalker/zooz/api/internal/utils"
)

type (
	AuthHandler struct {
		handler
		service AuthService
	}

	AuthService interface {
		Login(c context.Context, email, password string) (*models.User, error)
		RefreshToken(c context.Context, token string) (accessToken, refreshToken string, err error)
	}
)

func NewAuthHandler(s AuthService) *AuthHandler {
	return &AuthHandler{
		service: s,
	}
}

func (h *AuthHandler) RegisterRoutes(e *echo.Group) {
	auth := e.Group("/auth")
	auth.POST("/login", unwrap(h.Login))
	auth.POST("/refresh-token", unwrap(h.RefreshToken))
}

func (h *AuthHandler) Login(c echo.Context) error {
	type Request struct {
		Email    string `json:"email" form:"email" validate:"required,email"`
		Password string `json:"password" form:"password" validate:"required,min=8"`
	}

	var request Request
	if err := c.Bind(&request); err != nil {
		return err
	}

	if err := c.Validate(request); err != nil {
		return err
	}

	user, err := h.service.Login(utils.TransformEchoContext(c), request.Email, request.Password)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]any{
		"data": map[string]any{
			"user": user,
		},
	})
}

func (h *AuthHandler) RefreshToken(c echo.Context) error {
	type Request struct {
		RefreshToken string `json:"refreshToken" form:"refreshToken" validate:"required"`
	}

	var request Request
	if err := c.Bind(&request); err != nil {
		return err
	}

	if err := c.Validate(request); err != nil {
		return err
	}

	accessToken, refreshToken, err := h.service.RefreshToken(utils.TransformEchoContext(c), request.RefreshToken)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": map[string]any{
			"accessToken":  accessToken,
			"refreshToken": refreshToken,
		},
	})
}
