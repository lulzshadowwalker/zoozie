package auth

import (
	"context"
	"database/sql"

	"github.com/lulzshadowwalker/zoozie/api/internal/users"
)

// HACK: FIXME
type (
	repo struct {
		usersRepo
		database *sql.DB
	}

	usersRepo interface {
		GetUserByEmail(context.Context, string) (*users.User, error)
		GetUserById(context.Context, int) (*users.User, error)
	}
)

func NewRepo(database *sql.DB) *repo {
	usersRepoImpl := users.NewRepo(database)
	return &repo{
		usersRepo: usersRepoImpl,
		database:  database,
	}
}
