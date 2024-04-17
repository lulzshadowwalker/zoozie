package agencies

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

func getBaseQueryStatement(language string) SelectStatement {
	return SELECT(
		Agencies.ID,
		Agencies.Slug,
		Agencies.EmailAddress,
		Agencies.Logo,

		AgenciesI18n.Name,
		AgenciesI18n.Name,
		AgenciesI18n.Description,
		AgenciesI18n.LanguageCode,

		AgencyPhoneNumbers.CountryCode,
		AgencyPhoneNumbers.PhoneNumber,
	).
		FROM(
			Agencies.LEFT_JOIN(AgenciesI18n, Agencies.ID.EQ(AgenciesI18n.AgencyID).AND(AgenciesI18n.LanguageCode.EQ(String(language)))).
				LEFT_JOIN(AgencyPhoneNumbers, Agencies.ID.EQ(AgencyPhoneNumbers.AgencyID)),
		)
}

type repo struct {
	database *sql.DB
}

func NewRepo(database *sql.DB) *repo {
	return &repo{
		database: database,
	}
}

func (r *repo) GetAgencies(c context.Context) ([]Agency, error) {
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

	entities := make([]Agency, len(dest))
	for index, agency := range dest {
		entities[index], err = agency.ToEntity()
		if err != nil {
			return nil, fmt.Errorf("failed to convert agency because %w", err)
		}
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

	agency, err := dest.ToEntity()
	if err != nil {
		return nil, fmt.Errorf("failed to convert agency because %w", err)
	}

	return &agency, err
}

func (r *repo) GetAgencyAgentByUserID(c context.Context, userID int, tx interfaces.Transaction) (AgencyAgent, error) {
	stmt := SELECT(AgencyAgents.AllColumns).
		FROM(AgencyAgents).
		WHERE(AgencyAgents.UserID.EQ(Int(int64(userID))))

	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}
	var dest DBAgencyAgent
	err := stmt.QueryContext(c, db, &dest)
	if err != nil {
		return AgencyAgent{}, fmt.Errorf("failed to query the agency agent because %w", err)
	}

	return dest.ToEntity(), nil
}

func (r *repo) Begin(c context.Context) (interfaces.Transaction, error) {
	return r.database.Begin()
}

func (r *repo) CreateAgency(c context.Context, agency Agency, tx interfaces.Transaction) (Agency, error) {
	var dest dbAgency
	stmt := Agencies.
		INSERT(
			Agencies.EmailAddress,
			Agencies.Logo,
			Agencies.Slug,
		).
		VALUES(
			agency.EmailAddress,
			agency.Logo,
			agency.Slug,
		).
		RETURNING(Agencies.ID)

	err := stmt.QueryContext(c, tx, &dest)
	if err != nil {
		return Agency{}, fmt.Errorf("failed to insert agency because %w", err)
	}

	agency.ID = int(dest.Agency.ID)

	stmt = AgencyPhoneNumbers.INSERT(
		AgencyPhoneNumbers.AgencyID,

		AgencyPhoneNumbers.CountryCode,
		AgencyPhoneNumbers.PhoneNumber,
	).
		VALUES(
			agency.ID,
			agency.PhoneNumber.CountryCode,
			agency.PhoneNumber.PhoneNumber,
		)

	_, err = stmt.ExecContext(c, tx)
	if err != nil {
		return Agency{}, fmt.Errorf("failed to insert agency phone number because %w", err)
	}

	return agency, nil
}

func (r *repo) CreateAgencyI18n(c context.Context, i18n AgencyI18n, tx interfaces.Transaction) (AgencyI18n, error) {
	stmt := AgenciesI18n.INSERT(
		AgenciesI18n.Name,
		AgenciesI18n.Description,
		AgenciesI18n.LanguageCode,
		AgenciesI18n.AgencyID,
	).
		VALUES(
			i18n.Name,
			i18n.Description,
			i18n.LanguageCode,
			i18n.AgencyID,
		)

	var db qrm.Executable = r.database
	if tx != nil {
		db = tx
	}
	_, err := stmt.ExecContext(c, db)
	if err != nil {
		return AgencyI18n{}, fmt.Errorf("failed to insert agency i18n because %w", err)
	}

	return i18n, nil
}

func (r *repo) RegisterAgencyAgent(c context.Context, agent AgencyAgent, tx interfaces.Transaction) (AgencyAgent, error) {
	return AgencyAgent{}, nil
}
