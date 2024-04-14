package agencies

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

func getBaseQueryStatement(language string) SelectStatement {
	return SELECT(
		Agencies.ID,
		Agencies.Slug,
		Agencies.PhoneNumber,
		Agencies.EmailAddress,
		Agencies.Logo,
		AgenciesI18n.Name,
		AgenciesI18n.Name,
		AgenciesI18n.Description,
		AgenciesI18n.LanguageCode,
	).FROM(Agencies.LEFT_JOIN(AgenciesI18n, Agencies.ID.EQ(AgenciesI18n.AgencyID).AND(AgenciesI18n.LanguageCode.EQ(String(language)))))
}

type repo struct {
	database *sql.DB
}

func NewRepo(database *sql.DB) *repo {
	return &repo{
		database: database,
	}
}

func (r *repo) GetAgencies(c context.Context) ([]*Agency, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, fmt.Errorf("failed to get locale because %w", err)
	}

	stmt := getBaseQueryStatement(language)

	var dest []*dbAgency
	err = stmt.Query(r.database, &dest)
	if err != nil {
		return nil, fmt.Errorf("failed to query the agencies because %w", err)
	}

	entities := make([]*Agency, len(dest))
	for index, agency := range dest {
		entities[index] = agency.ToEntity()
	}

	return entities, nil
}

func (r *repo) GetAgencyBySlug(c context.Context, slug string) (*Agency, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, fmt.Errorf("failed to get locale because %w", err)
	}

	stmt := getBaseQueryStatement(language)

	var dest dbAgency
	err = stmt.Query(r.database, &dest)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return nil, nil
		}

		return nil, fmt.Errorf("failed to query the agencies because %w", err)
	}

	return dest.ToEntity(), err
}

func (r *repo) GetAgencyAgentByUserID(c context.Context, userID int) (AgencyAgent, error) {
	stmt := SELECT(AgencyAgents.AllColumns).
		WHERE(AgencyAgents.UserID.EQ(Int(int64(userID))))

	var dest DBAgencyAgent
	err := stmt.QueryContext(c, nil, &dest)
	if err != nil {
		return AgencyAgent{}, fmt.Errorf("failed to query the agency agent because %w", err)
	}

	return dest.ToEntity(), nil
}
