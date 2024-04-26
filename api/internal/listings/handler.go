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
		CreateListing(context.Context, createListingRequest) error
		GetListing(context.Context, getListingRequest) (Listing, error)
		GetAllListings(context.Context) ([]Listing, error)
		GetListingTypes(context.Context) ([]ListingType, error)
		GetListingLocations(context.Context) ([]Location, error)
		GetCustomerFavorites(context.Context) ([]Listing, error)
		ToggleListingFavorite(context.Context, toggleListingFavoriteRequest) (bool, error)
	}
)

func NewHandler(service Service) *handler {
	return &handler{
		service: service,
	}
}

func (h *handler) RegisterRoutes(e *echo.Group) {
	e.POST("/listings", utils.Unwrap(h.CreateListings), middleware.Auth(), middleware.WithAgencyAgent)
	e.GET("/listings", utils.Unwrap(h.GetAllListings))
	e.GET("/listings/:id", utils.Unwrap(h.GetListing))
	e.GET("/listings/types", utils.Unwrap(h.GetListingTypes))
	e.GET("/listings/locations", utils.Unwrap(h.GetListingLocations))
	e.GET("/listings/favorites", utils.Unwrap(h.GetCustomerFavoriteListings),
		middleware.Auth(),
		middleware.WithCustomer,
	)
	e.POST("/listings/:id/favorite", utils.Unwrap(h.ToggleListingFavorite),
		middleware.Auth(),
		middleware.WithCustomer,
	)
}

// TODO: write unit test
func (h *handler) CreateListings(c echo.Context) error {
	var request createListingRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	if len(request.Pictures) == 0 {
		return c.JSON(400, echo.Map{"message": "pictures must not be empty"})
	}

	err := h.service.CreateListing(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "listing created successfully"})
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

func (h *handler) GetListingTypes(c echo.Context) error {
	types, err := h.service.GetListingTypes(utils.TransformEchoContext(c))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"types": types,
		},
	})
}

func (h *handler) GetListingLocations(c echo.Context) error {
	locations, err := h.service.GetListingLocations(utils.TransformEchoContext(c))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"locations": locations,
		},
	})
}

func (h *handler) GetCustomerFavoriteListings(c echo.Context) error {
	listings, err := h.service.GetCustomerFavorites(utils.TransformEchoContext(c))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"listings": listings,
		},
	})
}

func (h *handler) ToggleListingFavorite(c echo.Context) error {
	var request toggleListingFavoriteRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	status, err := h.service.ToggleListingFavorite(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"favorite": status,
		},
	})
}
