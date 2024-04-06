package agencies

import (
	"context"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type handler struct {
	service Service
}

type Service interface {
	GetAgencies(context.Context) ([]*Agency, error)
	GetAgencyBySlug(c context.Context, request getAgencyBySlugRequest) (*Agency, error)
}

func NewHandler(s Service) *handler {
	return &handler{
		service: s,
	}
}

func (h *handler) RegisterRoutes(e *echo.Group) {
	e.GET("/agencies", h.GetAgencies)
}

func (h *handler) GetAgencies(c echo.Context) error {
	var request getAgencyBySlugRequest
	if err := c.Bind(&request); err != nil {
		return err
	}

	if err := c.Validate(request); err != nil {
		return err
	}

	if request.Slug != "" {
		agency, err := h.service.GetAgencyBySlug(utils.TransformEchoContext(c), request)
		if err != nil {
			return err
		}

		if agency == nil {
			return echo.NewHTTPError(http.StatusNotFound, fmt.Sprintf("agency with slug %s not found", request.Slug))
		}

		return c.JSON(http.StatusOK, map[string]any{
			"data": map[string]any{
				"agency": agency,
			},
		})
	}

	agencies, err := h.service.GetAgencies(utils.TransformEchoContext(c))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError)
	}

	return c.JSON(http.StatusOK, map[string]any{
		"data": map[string]any{
			"agencies": agencies,
		},
	})
}
