package handlers

import (
	"context"
	"log"
	"mime/multipart"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/dto"
	"github.com/lulzshadowwalker/zoozie/api/internal/models"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	UploadHandler struct {
		service UploadService
	}

	UploadService interface {
		Upload(c context.Context, files []*multipart.FileHeader) ([]models.Upload, error)
	}
)

func NewUploadsHandler(service UploadService) *UploadHandler {
	return &UploadHandler{
		service: service,
	}
}

func (h *UploadHandler) RegisterRoutes(e *echo.Group) {
	e.POST("/uploads", unwrap(h.Upload))
}

func (h *UploadHandler) Upload(c echo.Context) error {
	form, err := c.MultipartForm()
	if err != nil {
		log.Println(err)
		return utils.NewApiError(http.StatusBadRequest, "Content-Type must be set to multipart/form-data")
	}

	files := form.File["files"]
	if files == nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "'files' must not be empty"})
	}

	// TODO: limit upload file size

	request := &dto.UploadRequest{
		Files: files,
	}

	entities, err := h.service.Upload(utils.TransformEchoContext(c), request.Files)
	if err != nil {
		return err
	}

	response := make([]dto.UploadResponse, len(entities))
	for index, entity := range entities {
		response[index], err = dto.NewUploadResponseFromEntity(&entity)
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
