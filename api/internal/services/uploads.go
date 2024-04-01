package services

import (
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/google/uuid"
	"github.com/lulzshadowwalker/zoozie/api/internal/entity"
)

type (
	UploadsService struct {
		repo UploadsRepo
	}

	UploadsRepo interface {
		Upload(c context.Context, files []entity.Upload) ([]entity.Upload, error)
	}
)

func NewUploadsService(repo UploadsRepo) *UploadsService {
	return &UploadsService{
		repo: repo,
	}
}

func (s *UploadsService) Upload(c context.Context, files []*multipart.FileHeader) ([]entity.Upload, error) {
	// uid, err := utils.GetUser(c)
	// if err != nil {
	// 	return nil, err
	// }

	entities := make([]entity.Upload, len(files))
	for index, file := range files {
		id := uuid.NewString()

		destPath := fmt.Sprintf("public/%s/%s/%s/", id[0:1], id[0:2], id[0:3])

		err := os.MkdirAll(destPath, os.ModePerm)
		if err != nil {
			return nil, fmt.Errorf("failed to create directory because %w", err)
		}

		filepath := path.Join(destPath, id+path.Ext(file.Filename))
		dest, err := os.OpenFile(filepath, os.O_RDWR|os.O_CREATE, 0o666)
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
		e := &entities[index]
		*e = entity.Upload{
			File:             strings.TrimPrefix(filepath, "public/"),
			OriginalFileName: file.Filename,
			UploadedBy:       1, // TODO: protected route
		}
		log.Println(*e)

		buffer := make([]byte, 512)
		_, err = source.Read(buffer)
		if err != nil {
			mime := http.DetectContentType(buffer)
			e.FileType = &mime
		}
	}

	entities, err := s.repo.Upload(c, entities)
	if err != nil {
		return nil, err
	}

	return entities, nil
}
