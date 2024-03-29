package handlers

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/models"
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
	uid, err := utils.GetUser(utils.TransformEchoContext(c))

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
