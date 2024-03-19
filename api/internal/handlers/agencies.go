package handlers

import (
	"context"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zooz/api/internal/models"
	"github.com/lulzshadowwalker/zooz/api/internal/utils"
)

type AgenciesHandler struct {
	service AgenciesService
}

type AgenciesService interface {
	GetAgencies(context.Context) ([]*models.Agency, error)
  GetAgencyBySlug(c context.Context, slug string) (*models.Agency, error) 
}

func NewAgenciesHandler(s AgenciesService) *AgenciesHandler {
	return &AgenciesHandler{
		service: s,
	}
}

func (h *AgenciesHandler) GetAgencies(c echo.Context) error {
  slug := c.QueryParam("slug")
  if slug != "" {
    agency, err := h.service.GetAgencyBySlug(utils.TransformEchoContext(c), slug)
    if err != nil {
      return err 
    }

   if agency == nil {
      return echo.NewHTTPError(http.StatusNotFound, fmt.Sprintf("agency with slug %s not found", slug))
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
