package auth

import (
	"context"
	"database/sql"

	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/otp"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"
)

type (
	repo struct {
		usersRepo
		customersRepo
		otpRepo
		agenciesRepo
		database *sql.DB
	}

	usersRepo interface {
		CreateUser(context.Context, entities.User, interfaces.Transaction) (entities.User, error)
		GetUserByPhoneNumber(context.Context, entities.PhoneNumber) (*entities.User, error)
		GetUserById(context.Context, int, interfaces.Transaction) (*entities.User, error)
	}

	customersRepo interface {
		CreateCustomer(context.Context, customers.Customer, interfaces.Transaction) (customers.Customer, error)
		GetCustomerByUserID(context.Context, int, interfaces.Transaction) (customers.Customer, error)
	}

	otpRepo interface {
		StoreOTP(context.Context, otp.OTP, interfaces.Transaction) (otp.OTP, error)
		GetOTPByUserID(c context.Context, userID int) (otp.OTP, error)
		UpdateOTP(c context.Context, otp otp.OTP) (otp.OTP, error)
	}

	agenciesRepo interface {
		interfaces.Transactioner
		GetAgencyByID(context.Context, int, interfaces.Transaction) (*entities.Agency, error)
		GetAgencyAgentByUserID(c context.Context, userID int, tx interfaces.Transaction) (entities.AgencyAgent, error)
		RegisterAgencyAgent(c context.Context, agent entities.AgencyAgent, tx interfaces.Transaction) (entities.AgencyAgent, error)
	}
)

func NewRepo(database *sql.DB) *repo {
	usersRepoImpl := users.NewRepo(database)
	customersRepoImpl := customers.NewRepo(database)
	otpRepoImpl := otp.NewRepo(database)
	agenciesRepo := agencies.NewRepo(database)

	return &repo{
		database:      database,
		usersRepo:     usersRepoImpl,
		customersRepo: customersRepoImpl,
		otpRepo:       otpRepoImpl,
		agenciesRepo:  agenciesRepo,
	}
}

func (r *repo) Begin(c context.Context) (interfaces.Transaction, error) {
	return r.database.Begin()
}
