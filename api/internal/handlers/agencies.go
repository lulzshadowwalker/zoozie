package handlers

import (
	"context"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/dto"
	"github.com/lulzshadowwalker/zoozie/api/internal/entity"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type AgenciesHandler struct {
	handler
	service AgenciesService
}

type AgenciesService interface {
	GetAgencies(context.Context) ([]*entity.Agency, error)
	GetAgencyBySlug(c context.Context, request dto.GetAgencyBySlugRequest) (*entity.Agency, error)
}

func NewAgenciesHandler(s AgenciesService) *AgenciesHandler {
	return &AgenciesHandler{
		service: s,
	}
}

func (h *AgenciesHandler) RegisterRoutes(e *echo.Group) {
	e.GET("/agencies", h.GetAgencies)
}

func (h *AgenciesHandler) GetAgencies(c echo.Context) error {
	var request dto.GetAgencyBySlugRequest
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
