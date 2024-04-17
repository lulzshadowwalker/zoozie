package customers

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/go-jet/jet/qrm"
	"github.com/go-jet/jet/v2/postgres"
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	repo struct {
		database *sql.DB
	}
)

func NewRepo(database *sql.DB) *repo {
	return &repo{
		database: database,
	}
}

func (r *repo) CreateCustomer(c context.Context, customer Customer) (Customer, error) {
	tx, err := r.database.BeginTx(c, nil)
	if err != nil {
		return Customer{}, fmt.Errorf("failed to begin transaction because %w", err)
	}
	defer tx.Rollback()

	var dbUserRole model.UserRoles
	err = UserRoles.SELECT(UserRoles.ID, UserRoles.Name).
		WHERE(UserRoles.Name.EQ(postgres.String("customer"))).
		QueryContext(c, tx, &dbUserRole)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return Customer{},
				fmt.Errorf("failed to get user role because %w", err)
		}

		return Customer{}, err
	}

	// user
	userModel := users.DBUser{}
	err = Users.INSERT(
		Users.Name,
		Users.EmailAddress,
		Users.ProfilePicture,
		Users.Role,
	).VALUES(
		customer.User.Name,
		customer.User.EmailAddress,
		customer.User.ProfilePicture,
		dbUserRole.ID,
	).RETURNING(Users.AllColumns).
		QueryContext(c, tx, &userModel)
	if err != nil {
		return Customer{}, fmt.Errorf("failed to insert user because %w", err)
	}
	userID := userModel.User.ID

	// user phone number
	_, err = UserPhoneNumbers.INSERT(
		UserPhoneNumbers.UserID,
		UserPhoneNumbers.CountryCode,
		UserPhoneNumbers.PhoneNumber,
	).VALUES(
		userID,
		customer.User.PhoneNumber.CountryCode,
		customer.User.PhoneNumber.PhoneNumber,
	).ExecContext(c, tx)
	if err != nil {
		if utils.IsUniquePostgresViolationErr(err) {
			// NOTE: do not return the actual reason to the user to prevent information disclosure to potential attackers
			return Customer{}, fmt.Errorf("failed to register user because phone number already in use")
		}

		return Customer{}, fmt.Errorf("failed to insert user phone number because %w", err)
	}

	// customer
	_, err = Customers.
		INSERT(Customers.UserID).
		VALUES(userID).
		ExecContext(c, tx)
	if err != nil {
		return Customer{}, fmt.Errorf("failed to insert customer because %w", err)
	}

	customer.User = userModel.ToEntity()
	customer.User.Role = entities.Role(dbUserRole.Name)
	tx.Commit()
	return customer, nil
}
