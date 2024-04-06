package uploads

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/google/uuid"
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
	// uid, err := utils.GetUser(c)
	// if err != nil {
	// 	return nil, err
	// }

	entities := make([]Upload, len(files))
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
		*e = Upload{
			File:             strings.TrimPrefix(filepath, "public/"),
			OriginalFileName: file.Filename,
			UploadedBy:       1, // TODO: protected route
		}

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
