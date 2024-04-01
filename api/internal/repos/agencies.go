package repos

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/database/models"
	"github.com/lulzshadowwalker/zoozie/api/internal/entity"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type AgenciesRepo struct {
	database *sql.DB
}

func NewAgenciesRepo(database *sql.DB) *AgenciesRepo {
	return &AgenciesRepo{
		database: database,
	}
}

func (r *AgenciesRepo) GetAgencies(c context.Context) ([]*entity.Agency, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, fmt.Errorf("failed to get locale because %w", err)
	}

	stmt := SELECT(
		Agencies.ID,
		Agencies.Slug,
		Agencies.PhoneNumber,
		Agencies.EmailAddress,
		AgenciesI18n.Name,
		AgenciesI18n.Description,
		AgenciesI18n.LanguageCode,
	).FROM(Agencies.LEFT_JOIN(AgenciesI18n, Agencies.ID.EQ(AgenciesI18n.Agency))).WHERE(AgenciesI18n.LanguageCode.EQ(String(language)))

	var dest []*models.Agency
	err = stmt.Query(r.database, &dest)
	if err != nil {
		return nil, fmt.Errorf("failed to query the agencies because %w", err)
	}

	entities := make([]*entity.Agency, len(dest))
	for index, agency := range dest {
		entities[index] = agency.ToEntity()
	}

	return entities, nil
}

func (r *AgenciesRepo) GetAgencyBySlug(c context.Context, slug string) (*entity.Agency, error) {
	locale, err := utils.GetLocale(c)
	if err != nil {
		return nil, fmt.Errorf("failed to get locale because %w", err)
	}

	stmt := SELECT(
		Agencies.ID,
		Agencies.Slug,
		Agencies.PhoneNumber,
		Agencies.EmailAddress,
		AgenciesI18n.Name,
		AgenciesI18n.Description,
		AgenciesI18n.LanguageCode,
	).FROM(Agencies.LEFT_JOIN(AgenciesI18n, Agencies.ID.EQ(AgenciesI18n.Agency))).WHERE(AgenciesI18n.LanguageCode.EQ(String(locale)).AND(Agencies.Slug.EQ(String(slug))))

	var dest models.Agency
	err = stmt.Query(r.database, &dest)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return nil, nil
		}

		return nil, fmt.Errorf("failed to query the agencies because %w", err)
	}

	return dest.ToEntity(), err
}
