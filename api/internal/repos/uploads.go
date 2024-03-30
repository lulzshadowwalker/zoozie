package repos

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/lulzshadowwalker/zoozie/api/internal/models"
)

type UploadsRepo struct {
	database *sql.DB
}

func NewUploadsRepo(database *sql.DB) *UploadsRepo {
	return &UploadsRepo{
		database: database,
	}
}

func (r *UploadsRepo) Upload(c context.Context, files []models.Upload) ([]models.Upload, error) {
	tx, err := r.database.BeginTx(c, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction because %w", err)
	}
	defer tx.Rollback()

	query := `
		INSERT INTO uploads (
			file,
			original_file_name,
			file_type,
			user_id
		)
		VALUES($1, $2, $3, $4)
		RETURNING id;
	`
	stmt, err := tx.PrepareContext(c, query)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare the query to store uploaded files because %w", err)
	}

	for index := range files {
		file := &files[index]
		err = stmt.
			QueryRowContext(c, file.File, file.OriginalFileName, file.FileType, file.UploadedBy).
			Scan(&file.ID)
		if err != nil {
			return nil, fmt.Errorf("failed to store uploaded file in the database because %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("failed to commit transaction because %w", err)
	}

	return files, nil
}
