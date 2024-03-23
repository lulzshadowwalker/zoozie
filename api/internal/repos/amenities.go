package repos

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	. "github.com/lulzshadowwalker/zooz/api/internal/database/.gen/zooz/public/table"
	"github.com/lulzshadowwalker/zooz/api/internal/models"
	"github.com/lulzshadowwalker/zooz/api/internal/utils"
)

type AmenitiesRepo struct {
	database *sql.DB
}

func NewAmenitiesRepo(database *sql.DB) *AmenitiesRepo {
	return &AmenitiesRepo{
		database: database,
	}
}

func (r *AmenitiesRepo) GetAll(c context.Context) ([]*models.Amenity, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, err
	}

	stmt := SELECT(
		Amenities.ID,
		Amenities.Icon,
		Amenities.IsRequired,
		AmenitiesI18n.Title,
	).FROM(Amenities.LEFT_JOIN(AmenitiesI18n, Amenities.ID.EQ(AmenitiesI18n.AmenityID))).WHERE(AmenitiesI18n.LanguageCode.EQ(String(language)))

	var dest []*models.Amenity
	err = stmt.Query(r.database, &dest)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return nil, nil
		}

		return nil, fmt.Errorf("failed to query the agencies because %w", err)
	}

	return dest, err
}
