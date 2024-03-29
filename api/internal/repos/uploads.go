package repos

import (
	"context"
	"database/sql"
	"fmt"

	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/table"
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

func (r *UploadsRepo) Upload(c context.Context, files []models.Upload) error {
	stmt := Uploads.INSERT(
		Uploads.File,
		Uploads.UserID,
	)

	for _, file := range files {
		stmt = stmt.VALUES(file.File, file.UserID)
	}

	_, err := stmt.Exec(r.database)
	if err != nil {
		return fmt.Errorf("failed to store uploaded file in the database because %w", err)
	}

	return nil
}

