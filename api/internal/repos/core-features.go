package repos

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/models"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type CoreFeaturesRepo struct {
	database *sql.DB
}

func NewCoreFeaturesRepo(database *sql.DB) *CoreFeaturesRepo {
	return &CoreFeaturesRepo{
		database: database,
	}
}

func (r *CoreFeaturesRepo) GetAll(c context.Context) ([]*models.CoreFeature, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, err
	}

	stmt := SELECT(
		CoreFeatures.ID.AS("_id"),
		CoreFeatures.Icon,
		CoreFeatures.Required,
		CoreFeatures.DataType,
		CoreFeaturesI18n.Name,
		CoreFeaturesI18n.Description,
	).FROM(CoreFeatures.LEFT_JOIN(CoreFeaturesI18n, CoreFeatures.ID.EQ(CoreFeaturesI18n.CoreFeatureID))).WHERE(CoreFeaturesI18n.LanguageCode.EQ(String(language)))

	var dest []*models.CoreFeature
	err = stmt.Query(r.database, &dest)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return nil, nil
		}

		return nil, fmt.Errorf("failed to query the agencies because %w", err)
	}

	return dest, err
}
