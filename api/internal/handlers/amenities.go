package handlers

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zooz/api/internal/models"
	"github.com/lulzshadowwalker/zooz/api/internal/utils"
)

type (
	AmenitiesHandler struct {
		handler
		service AmenitiesService
	}

	AmenitiesService interface {
		GetAll(context.Context) ([]*models.Amenity, error)
	}
)

func NewAmenitiesHandler(service AmenitiesService) *AmenitiesHandler {
	return &AmenitiesHandler{
		service: service,
	}
}

func (h *AmenitiesHandler) RegisterRoutes(e *echo.Group) {
	e.GET("/amenities", h.GetAmenities)
}

func (h *AmenitiesHandler) GetAmenities(c echo.Context) error {
	amenities, err := h.service.GetAll(utils.TransformEchoContext(c))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"amenities": amenities,
		},
	})
}
