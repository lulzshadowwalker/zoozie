package repos

import (
	"context"
	"database/sql"
	"fmt"

	entity "github.com/lulzshadowwalker/zoozie/api/internal/entity"
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

func (r *CoreFeaturesRepo) GetAll(c context.Context) ([]*entity.CoreFeature, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, err
	}

	query := `
		SELECT 
			cf.id,
			cf.icon,
			cf.required,
			cf.data_type,

			i18n.name,
			i18n.description
		FROM 
			core_features cf
		LEFT JOIN
			core_features_i18n i18n
		ON
			cf.id = i18n.core_feature_id
		WHERE
			i18n.language_code = $1
	`
	rows, err := r.database.QueryContext(c, query, language)
	if err != nil {
		return nil, fmt.Errorf("failed to query the core features because %w", err)
	}

	features := make([]*entity.CoreFeature, 0)
	for rows.Next() {
		var f entity.CoreFeature
		err = rows.Scan(&f.ID, &f.Icon, &f.Requried, &f.DataType, &f.Name, &f.Description)
		if err != nil {
			return nil, fmt.Errorf("failed to scan the core features because %w", err)
		}

		features = append(features, &f)
	}

	return features, err
}
