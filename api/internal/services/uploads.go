package services

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path"
	"strings"

	"github.com/google/uuid"
	"github.com/lulzshadowwalker/zoozie/api/internal/models"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	UploadsService struct {
		repo UploadsRepo
	}

	UploadsRepo interface {
		Upload(c context.Context, files []models.Upload) error
	}
)

func NewUploadsService(repo UploadsRepo) *UploadsService {
	return &UploadsService{
		repo: repo,
	}
}

func (s *UploadsService) Upload(c context.Context, files []*multipart.FileHeader) ([]models.Upload, error) {
	uid, err := utils.GetUser(c)
	if err != nil {
		return nil, err
	}

	entities := make([]models.Upload, len(files))
	for index, file := range files {
		id := uuid.NewString()

		destPath := fmt.Sprintf("public/%s/%s/%s/", id[0:1], id[0:2], id[0:3])

		err := os.MkdirAll(destPath, os.ModePerm)
		if err != nil {
			return nil, fmt.Errorf("failed to create directory because %w", err)
		}

		filepath := path.Join(destPath, id+path.Ext(file.Filename))
		dest, err := os.OpenFile(filepath, os.O_RDWR|os.O_CREATE, 0666)
		if err != nil {
			return nil, fmt.Errorf("failed to open file because %w", err)
		}
		defer dest.Close()

		source, err := file.Open()
		if err != nil {
			return nil, fmt.Errorf("failed to open file because %w", err)
		}
		defer source.Close()

		_, err = io.Copy(dest, source)
		if err != nil {
			return nil, fmt.Errorf("failed to copy file because %w", err)
		}

		entities[index] = models.Upload{
			File:   strings.TrimPrefix(filepath, "public/"),
			UserID: int64(uid),
		}
	}

	if err := s.repo.Upload(c, entities); err != nil {
		return nil, err
	}

	return entities, nil
}
