package uploads

import (
	"context"
	"mime/multipart"
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
		Upload(c context.Context, files []*multipart.FileHeader) ([]Upload, error)
	}
)

func NewHandler(service Service) *handler {
	return &handler{
		service: service,
	}
}

func (h *handler) RegisterRoutes(e *echo.Group) {
	e.POST("/uploads", utils.Unwrap(h.Upload), middleware.Auth())
}

func (h *handler) Upload(c echo.Context) error {
	err := c.Request().ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "request is too large")
	}

	form, err := c.MultipartForm()
	if err != nil {
		return utils.NewApiError(http.StatusBadRequest, "Content-Type must be set to multipart/form-data")
	}

	files := form.File["files"]
	if files == nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "'files' must not be empty"})
	}

	request := &request{
		Files: files,
	}

	entities, err := h.service.Upload(utils.TransformEchoContext(c), request.Files)
	if err != nil {
		return err
	}

	response := make([]response, len(entities))
	for index, entity := range entities {
		response[index], err = newResponseFromEntity(&entity)
		if err != nil {
			return err
		}
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"files": response,
		},
	})
}
