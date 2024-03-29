package dto

import (
	"mime/multipart"
	"path"
	"strings"

	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/lulzshadowwalker/zoozie/api/internal/models"
)

type (
	UploadRequest struct {
		Files []*multipart.FileHeader `json:"file"`
	}

	UploadResponseMultiple struct {
		Data []UploadResponse `json:"data"`
	}

	UploadResponse struct {
		Url string `json:"url"`
	}
)

func NewUploadResponseFromEntity(entity *models.Upload) UploadResponse {
	sanitized := strings.TrimPrefix(entity.File, "public/")
	url := path.Join(config.GetAppUrl(), sanitized)

	return UploadResponse{
		Url: url,
	}
}
