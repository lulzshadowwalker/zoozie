//go:build wireinject

package auth

import (
	"database/sql"

	"github.com/google/wire"
)

func Init(database *sql.DB) *handler {
	wire.Build(
		NewHandler,
		NewService,
		wire.Bind(new(Service), new(*service)),
		NewRepo,
		wire.Bind(new(Repo), new(*repo)),
	)

	return &handler{}
}
