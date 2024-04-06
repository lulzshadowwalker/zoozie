package uploads

import (
	"fmt"
	"mime/multipart"
	"net/url"
	"strings"

	"github.com/lulzshadowwalker/zoozie/api/internal/config"
)

type (
	request struct {
		Files []*multipart.FileHeader `json:"files"`
	}

	responseMultiple struct {
		Data []response `json:"data"`
	}

	response struct {
		ID       int     `json:"id,omitempty"`
		Filename *string `json:"filename,omitempty"`
		FileType *string `json:"fileType,omitempty"`
		Url      string  `json:"url"`
	}
)

func newResponseFromEntity(entity *Upload) (response, error) {
	sanitized := strings.TrimPrefix(entity.File, "public/")
	url, err := url.JoinPath(config.GetAppUrl(), sanitized)
	if err != nil {
		return response{}, fmt.Errorf("failed to join path because %w", err)
	}

	return response{
		ID:       entity.ID,
		Filename: &entity.OriginalFileName,
		FileType: entity.FileType,
		Url:      url,
	}, nil
}
