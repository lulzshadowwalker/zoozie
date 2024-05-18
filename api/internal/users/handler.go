package users

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	handler struct {
		service Service
	}

	Service interface {
		GetUserById(c context.Context, id int) (*entities.User, error)
	}
)

func NewHandler(s Service) *handler {
	return &handler{
		service: s,
	}
}

func (h *handler) RegisterRoutes(e *echo.Group) {
	e.GET("/me", utils.Unwrap(h.GetUser))
}

func (h *handler) GetUser(c echo.Context) error {
	uid, err := utils.GetUserID(utils.TransformEchoContext(c))
	if err != nil {
		return err
	}

	user, err := h.service.GetUserById(utils.TransformEchoContext(c), uid)
	if err != nil {
		return err
	}

	response, err := newResponseFromEntity(user)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"user": response,
		},
	})
}
