package dto

import (
	"fmt"
	"mime/multipart"
	"net/url"
	"strings"

	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/lulzshadowwalker/zoozie/api/internal/models"
)

type (
	UploadRequest struct {
		Files []*multipart.FileHeader `json:"files"`
	}

	UploadResponseMultiple struct {
		Data []UploadResponse `json:"data"`
	}

	UploadResponse struct {
		ID       int    `json:"id,omitempty"`
		Filename string `json:"filename,omitempty"`
		FileType string `json:"fileType,omitempty"`
		Url      string `json:"url"`
	}
)

func NewUploadResponseFromEntity(entity *models.Upload) (UploadResponse, error) {
	sanitized := strings.TrimPrefix(entity.File, "public/")
	url, err := url.JoinPath(config.GetAppUrl(), sanitized)
	if err != nil {
		return UploadResponse{}, fmt.Errorf("failed to join path because %w", err)
	}

	return UploadResponse{
		ID:       entity.ID,
		Filename: entity.OriginalFileName,
		FileType: entity.FileType,
		Url:      url,
	}, nil
}
