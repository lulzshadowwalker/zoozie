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
	ListingsHandler struct {
		handler
		service ListingsService
	}

	ListingsService interface {
		CreateListing(context.Context, dto.CreateListingRequest) (models.Listing, error)
	}
)

func NewListingsHandler(service ListingsService) *ListingsHandler {
	return &ListingsHandler{
		service: service,
	}
}

func (h *ListingsHandler) RegisterRoutes(e *echo.Group) {
	// TODO: admin middleware also per agency
	e.POST("/listings", unwrap(h.CreateListings))
}

// TODO: write unit test
func (h *ListingsHandler) CreateListings(c echo.Context) error {
	var request dto.CreateListingRequest
	if err := c.Bind(&request); err != nil {
		return err
	}

	if err := c.Validate(&request); err != nil {
		return err
	}

	if len(request.Pictures) == 0 {
		return c.JSON(400, echo.Map{"message": "pictures must not be empty"})
	}

	entity, err := h.service.CreateListing(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"listing": entity,
		},
	})
}
