package customers

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/go-jet/jet/v2/qrm"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
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

func (r *repo) CreateCustomer(c context.Context, customer Customer, tx interfaces.Transaction) (Customer, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbCustomer DBCustomer
	if err := Customers.
		INSERT(Customers.UserID).
		VALUES(customer.UserID).
		RETURNING((Customers.ID)).QueryContext(
		c,
		db,
		&dbCustomer,
	); err != nil {
		return Customer{}, fmt.Errorf("failed to insert customer because %w", err)
	}

	return dbCustomer.ToEntity(), nil
}
