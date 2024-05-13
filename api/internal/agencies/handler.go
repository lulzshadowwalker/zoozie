package agencies

import (
	"context"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/server/middleware"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type handler struct {
	service Service
}

type Service interface {
	GetAgencies(context.Context) ([]entities.Agency, error)
	CreateAgency(c context.Context, request createAgencyRequest) (entities.Agency, error)
	GetAgencyBySlug(c context.Context, request getAgencyBySlugRequest) (*entities.Agency, error)
	GetAgencyReviews(c context.Context, request getAgencyReviewsRequest) ([]entities.AgencyReview, error)
	CreateAgencyReview(c context.Context, request createAgencyReviewRequest) (entities.AgencyReview, error)
	ToggleAgencyFollowRequest(c context.Context, request toggleAgencyFollowRequest) (bool, error)
}

func NewHandler(s Service) *handler {
	return &handler{
		service: s,
	}
}

func (h *handler) RegisterRoutes(e *echo.Group) {
	e.GET("/agencies", utils.Unwrap(h.GetAgencies))
	e.POST(
		"/agencies",
		utils.Unwrap(h.CreateAgency),
		// TODO: activate POST /agencies middleware:
		//		middleware.WithZoozieAdmin,
	)
	e.GET("/agencies/:id/reviews", utils.Unwrap(h.GetAgencyReviews))
	e.POST("/agencies/:id/reviews", utils.Unwrap(h.CreateAgencyReview), middleware.Auth(), middleware.WithCustomer)
	e.POST("/agencies/:id/follows", utils.Unwrap(h.ToggleAgencyFollow), middleware.Auth(), middleware.WithCustomer)
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

func (h *handler) CreateAgency(c echo.Context) error {
	var request createAgencyRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	agency, err := h.service.CreateAgency(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"agency": agency,
		},
	})
}

func (h *handler) GetAgencyReviews(c echo.Context) error {
	var request getAgencyReviewsRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	reviews, err := h.service.GetAgencyReviews(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"reviews": reviews,
		},
	})
}

func (h *handler) CreateAgencyReview(c echo.Context) error {
	var request createAgencyReviewRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	review, err := h.service.CreateAgencyReview(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"review": review,
		},
	})
}

func (h *handler) ToggleAgencyFollow(c echo.Context) error {
	var request toggleAgencyFollowRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	status, err := h.service.ToggleAgencyFollowRequest(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"following": status,
		},
	})
}
