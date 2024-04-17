package interfaces

import (
	"context"
	"database/sql"
)

type (
	Transactioner interface {
		Begin(c context.Context) (Transaction, error)
	}

	Transaction interface {
		Exec(query string, args ...interface{}) (sql.Result, error)
		ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
		Query(query string, args ...interface{}) (*sql.Rows, error)
		QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)

		Commit() error
		Rollback() error
	}
)
