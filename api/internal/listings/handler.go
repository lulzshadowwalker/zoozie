package listings

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/server/middleware"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	handler struct {
		service Service
	}

	Service interface {
		CreateListing(context.Context, createListingRequest) (Listing, error)
		GetListing(context.Context, getListingRequest) (Listing, error)
		GetAllListings(context.Context) ([]Listing, error)
	}
)

func NewHandler(service Service) *handler {
	return &handler{
		service: service,
	}
}

func (h *handler) RegisterRoutes(e *echo.Group) {
	// TODO: admin middleware also per agency
	e.POST("/listings", utils.Unwrap(h.CreateListings), middleware.Auth())
	e.GET("/listings", utils.Unwrap(h.GetAllListings))
	e.GET("/listings/:id", utils.Unwrap(h.GetListing))
}

// TODO: write unit test
func (h *handler) CreateListings(c echo.Context) error {
	var request createListingRequest
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

func (h *handler) GetListing(c echo.Context) error {
	var request getListingRequest
	if err := c.Bind(&request); err != nil {
		return err
	}

	if err := c.Validate(&request); err != nil {
		return err
	}

	listing, err := h.service.GetListing(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"listing": listing,
		},
	})
}

func (h *handler) GetAllListings(c echo.Context) error {
	entities, err := h.service.GetAllListings(utils.TransformEchoContext(c))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"listings": entities,
		},
	})
}
