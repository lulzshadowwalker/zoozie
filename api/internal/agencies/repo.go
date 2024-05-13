package agencies

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

func getBaseQueryStatement(language string, customerID *int) SelectStatement {
	fromClause :=
		Agencies.LEFT_JOIN(AgenciesI18n, Agencies.ID.EQ(AgenciesI18n.AgencyID).AND(AgenciesI18n.LanguageCode.EQ(String(language)))).
			LEFT_JOIN(AgencyPhoneNumbers, Agencies.ID.EQ(AgencyPhoneNumbers.AgencyID))

	cid := 0
	if customerID != nil {
		cid = *customerID
	}

	fromClause = fromClause.LEFT_JOIN(CustomerFollowedAgencies, CustomerFollowedAgencies.AgencyID.EQ(Agencies.ID).AND(CustomerFollowedAgencies.CustomerID.EQ(Int(int64(cid)))))

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

		CASE().WHEN(CustomerFollowedAgencies.CustomerID.EQ(Int(int64(cid)))).THEN(Bool(true)).ELSE(Bool(false)).AS("dbagency.following"),
	).
		FROM(fromClause)
}

type repo struct {
	database *sql.DB
}

func NewRepo(database *sql.DB) *repo {
	return &repo{
		database: database,
	}
}

func (r *repo) GetAgencies(c context.Context) ([]entities.Agency, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, fmt.Errorf("failed to get locale because %w", err)
	}

	var customerID *int = nil
	if cid, err := utils.GetCustomerID(c); err == nil {
		customerID = &cid
	}

	stmt := getBaseQueryStatement(language, customerID)

	var dest []*dbAgency
	err = stmt.Query(r.database, &dest)
	if err != nil {
		return nil, fmt.Errorf("failed to query the agencies because %w", err)
	}

	entities := make([]entities.Agency, len(dest))
	for index, agency := range dest {
		entities[index], err = agency.ToEntity()
		if err != nil {
			return nil, fmt.Errorf("failed to convert agency because %w", err)
		}
	}

	return entities, nil
}

func (r *repo) GetAgencyBySlug(c context.Context, slug string) (*entities.Agency, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, fmt.Errorf("failed to get locale because %w", err)
	}

	var customerID *int = nil
	if cid, err := utils.GetCustomerID(c); err == nil {
		customerID = &cid
	}

	stmt := getBaseQueryStatement(language, customerID).
		WHERE(Agencies.Slug.EQ(String(slug)))

	var dest dbAgency
	err = stmt.Query(r.database, &dest)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return nil, err
		}

		return nil, fmt.Errorf("failed to query the agencies because %w", err)
	}

	agency, err := dest.ToEntity()
	if err != nil {
		return nil, fmt.Errorf("failed to convert agency because %w", err)
	}

	return &agency, err
}

func (r *repo) GetAgencyByID(c context.Context, id int, tx interfaces.Transaction) (*entities.Agency, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, fmt.Errorf("failed to get locale because %w", err)
	}

	var customerID *int = nil
	if cid, err := utils.GetCustomerID(c); err == nil {
		customerID = &cid
	}

	stmt := getBaseQueryStatement(language, customerID).
		WHERE(Agencies.ID.EQ(Int(int64(id))))

	var dest dbAgency
	err = stmt.QueryContext(c, db, &dest)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return nil, err
		}

		return nil, fmt.Errorf("failed to query the agencies because %w", err)
	}

	agency, err := dest.ToEntity()
	if err != nil {
		return nil, fmt.Errorf("failed to convert agency because %w", err)
	}

	return &agency, err
}

func (r *repo) GetAgencyAgentByUserID(c context.Context, userID int, tx interfaces.Transaction) (entities.AgencyAgent, error) {
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
		return entities.AgencyAgent{}, fmt.Errorf("failed to query the agency agent because %w", err)
	}

	return dest.ToEntity(), nil
}

func (r *repo) Begin(c context.Context) (interfaces.Transaction, error) {
	return r.database.Begin()
}

func (r *repo) CreateAgency(c context.Context, agency entities.Agency, tx interfaces.Transaction) (entities.Agency, error) {
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

	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}
	err := stmt.QueryContext(c, db, &dest)
	if err != nil {
		if utils.IsUniquePostgresViolationErr(err) {
			// NOTE: do not return the actual reason to the user to prevent information disclosure to potential attackers
			return entities.Agency{}, fmt.Errorf("failed to register agency because phone number already in use")
		}

		return entities.Agency{}, fmt.Errorf("failed to insert agency because %w", err)
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
		return entities.Agency{}, fmt.Errorf("failed to insert agency phone number because %w", err)
	}

	return agency, nil
}

func (r *repo) CreateAgencyI18n(c context.Context, i18n entities.AgencyI18n, tx interfaces.Transaction) (entities.AgencyI18n, error) {
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
		return entities.AgencyI18n{}, fmt.Errorf("failed to insert agency i18n because %w", err)
	}

	return i18n, nil
}

func (r *repo) RegisterAgencyAgent(c context.Context, agent entities.AgencyAgent, tx interfaces.Transaction) (entities.AgencyAgent, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbAgent DBAgencyAgent
	stmt := AgencyAgents.INSERT(
		AgencyAgents.UserID,
		AgencyAgents.AgencyID,
	).VALUES(
		agent.UserID,
		agent.AgencyID,
	).RETURNING(AgencyAgents.ID)

	if err := stmt.QueryContext(c, db, &dbAgent); err != nil {
		return entities.AgencyAgent{}, fmt.Errorf("failed to insert agency agent because %w", err)
	}
	agent.ID = int(dbAgent.AgencyAgent.ID)

	return agent, nil
}

func (r *repo) GetAgencyReviews(c context.Context, id int, tx interfaces.Transaction) ([]entities.AgencyReview, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dest []DBAgencyReview
	if err := SELECT(
		AgencyReviews.AllColumns,
		Customers.ID,
		Customers.UserID,
		Users.ID,
		Users.Name,
		Users.EmailAddress,
		Users.ProfilePicture,
	).
		FROM(
			AgencyReviews.
				LEFT_JOIN(Customers, Customers.ID.EQ(AgencyReviews.CustomerID)).
				LEFT_JOIN(Users, Users.ID.EQ(Customers.UserID)),
		).
		WHERE(AgencyReviews.AgencyID.EQ(Int(int64(id)))).QueryContext(c, db, &dest); err != nil {
		return nil, fmt.Errorf("failed to query the agency review because %w", err)
	}

	reviews := make([]entities.AgencyReview, len(dest))
	for index, review := range dest {
		reviews[index] = review.ToEntity()
	}

	return reviews, nil
}

func (r *repo) CreateAgencyReview(c context.Context, review entities.AgencyReview, tx interfaces.Transaction) (entities.AgencyReview, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dest DBAgencyReview
	if err := AgencyReviews.INSERT(
		AgencyReviews.AgencyID,
		AgencyReviews.CustomerID,
		AgencyReviews.Content,
		AgencyReviews.Rating,
	).VALUES(
		review.AgencyID,
		review.CustomerID,
		review.Content,
		review.Rating,
	).RETURNING(AgencyReviews.AllColumns).QueryContext(c, db, &dest); err != nil {
		return entities.AgencyReview{}, fmt.Errorf("failed to insert agency review because %w", err)
	}

	return dest.ToEntity(), nil
}

func (r *repo) ToggleAgencyFollow(c context.Context, customerID, agencyID int, tx interfaces.Transaction) (bool, error) {
	var db qrm.Executable = r.database
	if tx != nil {
		db = tx
	}

	if _, err := CustomerFollowedAgencies.INSERT(
		CustomerFollowedAgencies.CustomerID,
		CustomerFollowedAgencies.AgencyID,
	).VALUES(
		Int(int64(customerID)),
		Int(int64(agencyID)),
	).ExecContext(c, db); err != nil {
		if utils.IsUniquePostgresViolationErr(err) {
			if err := r.DeleteAgencyFollow(c, customerID, agencyID, tx); err != nil {
				return false, err
			}

			return false, nil
		}

		return false, fmt.Errorf("failed to insert agency follow because %w", err)
	}

	return true, nil
}

func (r *repo) DeleteAgencyFollow(c context.Context, customerID, agencyID int, tx interfaces.Transaction) error {
	var db qrm.Executable = r.database
	if tx != nil {
		db = tx
	}

	if _, err := CustomerFollowedAgencies.DELETE().WHERE(
		CustomerFollowedAgencies.CustomerID.EQ(Int(int64(customerID))).AND(
			CustomerFollowedAgencies.AgencyID.EQ(Int(int64(agencyID)))),
	).ExecContext(c, db); err != nil {
		return fmt.Errorf("failed to delete agency follow because %w", err)
	}

	return nil
}
