package customers

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
)

type DBCustomer struct {
	Customer model.Customers
}

func (c *DBCustomer) ToEntity() Customer {
	return Customer{
		ID:     int(c.Customer.ID),
		UserID: int(c.Customer.ID),
	}
}
