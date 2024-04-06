//go:build wireinject

package uploads

import (
	"database/sql"

	"github.com/google/wire"
)

func Init(datbase *sql.DB) *handler {
	wire.Build(
		NewHandler,
		NewService,
		wire.Bind(new(Service), new((*service))),
		NewRepo,
		wire.Bind(new(Repo), new((*repo))),
	)

	return &handler{}
}
