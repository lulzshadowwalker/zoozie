package auth

import (
	"context"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	handler struct {
		service Service
	}

	Service interface {
		Login(c context.Context, email, password string) (*users.User, error)
		RefreshToken(c context.Context, token string) (accessToken, refreshToken string, err error)
	}
)

func NewHandler(s Service) *handler {
	return &handler{
		service: s,
	}
}

func (h *handler) RegisterRoutes(e *echo.Group) {
	auth := e.Group("/auth")
	auth.POST("/login", utils.Unwrap(h.Login))
	auth.POST("/refresh-token", utils.Unwrap(h.RefreshToken))
}

func (h *handler) Login(c echo.Context) error {
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

	h.setCookies(c, user.AccessToken, user.RefreshToken)

	return c.JSON(http.StatusOK, map[string]any{
		"data": map[string]any{
			"user": user,
		},
	})
}

func (h *handler) RefreshToken(c echo.Context) error {
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

	h.setCookies(c, accessToken, refreshToken)

	return c.JSON(http.StatusOK, echo.Map{
		"data": map[string]any{
			"accessToken":  accessToken,
			"refreshToken": refreshToken,
		},
	})
}

func (h *handler) setCookies(c echo.Context, accessToken, refreshToken string) {
	accessTokenCookie := http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		HttpOnly: true,
		Secure:   true,
		Expires:  time.Now().Add(time.Hour * 24 * 30),
	}

	refreshTokenCookie := http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		Secure:   true,
		Expires:  time.Now().Add(time.Hour * 24 * 30),
	}

	c.SetCookie(&accessTokenCookie)
	c.SetCookie(&refreshTokenCookie)
}
