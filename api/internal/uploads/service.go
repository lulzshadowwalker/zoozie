package uploads

import (
	"context"
	"log"
	"mime/multipart"
	"strings"

	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	service struct {
		repo Repo
	}

	Repo interface {
		Upload(c context.Context, files []Upload) ([]Upload, error)
	}
)

func NewService(repo Repo) *service {
	return &service{
		repo: repo,
	}
}

func (s *service) Upload(c context.Context, files []*multipart.FileHeader) ([]Upload, error) {
	uid, err := utils.GetUserID(c)
	if err != nil {
		return nil, err
	}

	log.Println("user id uploads", uid)

	entities := make([]Upload, len(files))
	for index, file := range files {
		fileInfo, err := utils.StoreFile(file)
		if err != nil {
			return nil, err
		}

		e := &entities[index]
		*e = Upload{
			File:             strings.TrimPrefix(fileInfo.Path, "public/"),
			OriginalFileName: file.Filename,
			UploadedBy:       uid,
		}

		e.FileType = &fileInfo.MimeType
	}

	entities, err = s.repo.Upload(c, entities)
	if err != nil {
		return nil, err
	}

	return entities, nil
}
