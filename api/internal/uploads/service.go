package uploads

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"mime/multipart"
	"os"
	"path"
	"strings"

	"github.com/gabriel-vasile/mimetype"
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
			UploadedBy:       -42069, // TODO: protected route
		}

		buffer := make([]byte, 512)
		_, err = dest.Seek(0, 0)
		if err != nil {
			slog.ErrorContext(c, "failed to seek to file origin", "err", err)
			continue
		}

		_, err = dest.Read(buffer)
		if err != nil {
			slog.ErrorContext(c, "failed to detect mime type", "err", err)
		}

		mime := mimetype.Detect(buffer).String()
		e.FileType = &mime
	}

	entities, err := s.repo.Upload(c, entities)
	if err != nil {
		return nil, err
	}

	return entities, nil
}
