package repos

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/table"
	entity "github.com/lulzshadowwalker/zoozie/api/internal/entity"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type UserRepo struct {
	database *sql.DB
}

func NewUserRepo(database *sql.DB) *UserRepo {
	return &UserRepo{
		database: database,
	}
}

func (r *UserRepo) GetUserById(c context.Context, id int) (*entity.User, error) {
	stmt := Users.SELECT(Users.AllColumns).
		WHERE(Users.ID.EQ(Int(int64(id))))

	var user entity.User
	err := stmt.Query(r.database, &user)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return nil, utils.NewApiError(http.StatusNotFound, fmt.Sprintf("user with id %d not found", id))
		}

		return nil, fmt.Errorf("failed to query the users because %w", err)
	}

	return &user, nil
}

func (r *UserRepo) GetUserByEmail(c context.Context, email string) (*entity.User, error) {
	stmt := Users.SELECT(Users.AllColumns).
		WHERE(Users.EmailAddress.EQ(String(email)))

	var user entity.User
	err := stmt.Query(r.database, &user)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return nil, utils.NewApiError(http.StatusNotFound, fmt.Sprintf("user with email %s not found", email))
		}

		return nil, fmt.Errorf("failed to query the users because %w", err)
	}

	return &user, nil
}

func (r *UserRepo) UpdateUserLastLogin(c context.Context, id int) error {
	_, err := Users.UPDATE(Users.LastLoginAt).
		SET(NOW()).
		WHERE(Users.ID.EQ(Int(int64(id)))).
		Exec(r.database)
	if err != nil {
		return fmt.Errorf("failed to update last login time because %w", err)
	}

	return nil
}
