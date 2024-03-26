package handlers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/models"
	"github.com/lulzshadowwalker/zoozie/api/internal/services"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	UserHandler struct {
		handler
		service UserService
	}

	UserService interface {
		GetUserById(c context.Context, id int) (*models.User, error)
	}
)

func NewUserHandler(s UserService) *UserHandler {
	return &UserHandler{
		service: s,
	}
}

func (h *UserHandler) RegisterRoutes(e *echo.Group) {
	e.GET("/me", unwrap(h.GetUser))
}

func (h *UserHandler) GetUser(c echo.Context) error {
	// TODO :check for absent value
	u, ok := c.Get("user").(*jwt.Token)
	if !ok {
		return errors.New("echo.Context.Get(\"user\") is not *jwt.Token")
	}

	if u == nil || !u.Valid {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}

	claims := u.Claims.(*services.JwtCustomClaims)
  uidString := claims.Subject
	uid, err := strconv.Atoi(uidString)
	if err != nil {
		return fmt.Errorf("failed to parse the user id because %w", err)
	}

	user, err := h.service.GetUserById(utils.TransformEchoContext(c), uid)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"user": *user,
		},
	})
}
