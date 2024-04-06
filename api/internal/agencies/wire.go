//go:build wireinject

package agencies

import (
	"database/sql"

	"github.com/google/wire"
)

func Initialize(database *sql.DB) *handler {
	wire.Build(
		NewHandler,
		NewService,
		wire.Bind(new(Service), new(*service)),
		NewRepo,
		wire.Bind(new(Repo), new(*repo)),
	)
	return &handler{}
}
