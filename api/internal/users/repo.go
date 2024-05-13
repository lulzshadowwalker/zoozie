package users

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

var baseQueryStatement = SELECT(
	Users.AllColumns,
	UserPhoneNumbers.CountryCode,
	UserPhoneNumbers.PhoneNumber,
	UserRoles.Name,
	AgencyAgents.AllColumns,
).
	FROM(
		Users.
			LEFT_JOIN(UserPhoneNumbers, Users.ID.EQ(UserPhoneNumbers.UserID)).
			LEFT_JOIN(UserRoles, Users.Role.EQ(UserRoles.ID)).
			LEFT_JOIN(AgencyAgents, Users.ID.EQ(AgencyAgents.UserID)),
	)

type repo struct {
	database *sql.DB
}

func NewRepo(database *sql.DB) *repo {
	return &repo{
		database: database,
	}
}

func (r *repo) CreateUser(c context.Context, user entities.User, tx interfaces.Transaction) (entities.User, error) {
	var dbUserRole model.UserRoles
	err := UserRoles.SELECT(UserRoles.ID, UserRoles.Name).
		WHERE(UserRoles.Name.EQ(String(string(user.Role)))).
		QueryContext(c, tx, &dbUserRole)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return entities.User{},

				// NOTE: do not return status 404
				fmt.Errorf("failed to get user role %q because it was not found", user.Role)
		}

		return entities.User{}, err
	}

	userModel := DBUser{}
	err = Users.INSERT(
		Users.Name,
		Users.EmailAddress,
		Users.ProfilePicture,
		Users.Role,
	).VALUES(
		user.Name,
		user.EmailAddress,
		user.ProfilePicture,
		dbUserRole.ID,
	).RETURNING(Users.ID).
		QueryContext(c, tx, &userModel)
	if err != nil {
		return entities.User{}, fmt.Errorf("failed to insert user because %w", err)
	}
	userID := userModel.User.ID

	// user phone number
	_, err = UserPhoneNumbers.INSERT(
		UserPhoneNumbers.UserID,
		UserPhoneNumbers.CountryCode,
		UserPhoneNumbers.PhoneNumber,
	).VALUES(
		userID,
		user.PhoneNumber.CountryCode,
		user.PhoneNumber.PhoneNumber,
	).ExecContext(c, tx)
	if err != nil {
		if utils.IsUniquePostgresViolationErr(err) {
			// NOTE: do not return the actual reason to the user to prevent information disclosure to potential attackers
			return entities.User{}, fmt.Errorf("failed to register user because phone number already in use")
		}

		return entities.User{}, fmt.Errorf("failed to insert user phone number because %w", err)
	}

	user.ID = int64(userID)
	return user, nil
}

func (r *repo) GetUserByPhoneNumber(c context.Context, phoneNumber entities.PhoneNumber) (*entities.User, error) {
	stmt := baseQueryStatement.
		WHERE(
			UserPhoneNumbers.CountryCode.EQ(String(phoneNumber.CountryCode)).
				AND(UserPhoneNumbers.PhoneNumber.EQ(String(phoneNumber.PhoneNumber))),
		).LIMIT(1)

	var user DBUser
	err := stmt.Query(r.database, &user)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			// TODO: might want to obfuscate the exact error to prevent information disclosure attack
			return nil, utils.NewApiError(http.StatusNotFound, fmt.Sprintf("user with phone number +%s%s not found", phoneNumber.CountryCode, phoneNumber.PhoneNumber))
		}

		return nil, fmt.Errorf("failed to query the users because %w", err)
	}

	entity := user.ToEntity()
	return &entity, nil
}

func (r *repo) GetUserById(c context.Context, id int, tx interfaces.Transaction) (*entities.User, error) {
	stmt := baseQueryStatement.
		WHERE(Users.ID.EQ(Int(int64(id))))

	var user DBUser
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}
	err := stmt.Query(db, &user)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return nil, utils.NewApiError(http.StatusNotFound, fmt.Sprintf("user with id %d not found", id))
		}

		return nil, fmt.Errorf("failed to query the users because %w", err)
	}

	entity := user.ToEntity()
	return &entity, nil
}

func (r *repo) UpdateUserLastLogin(c context.Context, id int) error {
	_, err := Users.UPDATE(Users.LastLoginAt).
		SET(NOW()).
		WHERE(Users.ID.EQ(Int(int64(id)))).
		Exec(r.database)
	if err != nil {
		return fmt.Errorf("failed to update last login time because %w", err)
	}

	return nil
}
