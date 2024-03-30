package handlers

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/dto"
	"github.com/lulzshadowwalker/zoozie/api/internal/models"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	CoreFeaturesHandler struct {
		handler
		service CoreFeaturesService
	}

	CoreFeaturesService interface {
		GetAll(context.Context) ([]*models.CoreFeature, error)
	}
)

func NewCoreFeaturesHandler(service CoreFeaturesService) *CoreFeaturesHandler {
	return &CoreFeaturesHandler{
		service: service,
	}
}

// TODO: might wanna move the core features / amenities to /listings
func (h *CoreFeaturesHandler) RegisterRoutes(e *echo.Group) {
	e.GET("/listings/core-features", h.GetCoreFeatures)
}

func (h *CoreFeaturesHandler) GetCoreFeatures(c echo.Context) error {
	features, err := h.service.GetAll(utils.TransformEchoContext(c))
	if err != nil {
		return err
	}

	responseFeatures := make([]dto.CoreFeaturesResponse, len(features))
	for index, feature := range features {
		responseFeatures[index] = dto.ToCoreFeaturesResponse(feature)
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"coreFeatures": responseFeatures,
		},
	})
}
