package uploads

import (
	"mime/multipart"

	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
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
	url, err := utils.GetFileURL(entity.File)
	if err != nil {
		return response{}, err
	}

	return response{
		ID:       entity.ID,
		Filename: &entity.OriginalFileName,
		FileType: entity.FileType,
		Url:      url,
	}, nil
}
