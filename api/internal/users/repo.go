package users

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

var baseQueryStatement = SELECT(
	Users.AllColumns,
	UserPhoneNumbers.CountryCode,
	UserPhoneNumbers.PhoneNumber,
	UserRoles.Name,
).
	FROM(
		Users.
			LEFT_JOIN(UserPhoneNumbers, Users.ID.EQ(UserPhoneNumbers.UserID)).
			LEFT_JOIN(UserRoles, Users.Role.EQ(UserRoles.ID)),
	)

type repo struct {
	database *sql.DB
}

func NewRepo(database *sql.DB) *repo {
	return &repo{
		database: database,
	}
}

func (r *repo) GetUserByPhoneNumber(c context.Context, phoneNumber entities.PhoneNumber) (*User, error) {
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

func (r *repo) GetUserById(c context.Context, id int) (*User, error) {
	stmt := baseQueryStatement.
		WHERE(Users.ID.EQ(Int(int64(id))))

	var user DBUser
	err := stmt.Query(r.database, &user)
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
