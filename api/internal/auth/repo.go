package auth

import (
	"context"
	"database/sql"

	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies/otp"
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
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
		CreateUser(context.Context, users.User, interfaces.Transaction) (users.User, error)
		GetUserByPhoneNumber(context.Context, entities.PhoneNumber) (*users.User, error)
		GetUserById(context.Context, int, interfaces.Transaction) (*users.User, error)
	}

	customersRepo interface {
		CreateCustomer(context.Context, customers.Customer, interfaces.Transaction) (customers.Customer, error)
	}

	otpRepo interface {
		StoreOTP(context.Context, otp.OTP, interfaces.Transaction) (otp.OTP, error)
		GetOTPByUserID(c context.Context, userID int) (otp.OTP, error)
		UpdateOTP(c context.Context, otp otp.OTP) (otp.OTP, error)
	}

	agenciesRepo interface {
		interfaces.Transactioner
		GetAgencyAgentByUserID(c context.Context, userID int, tx interfaces.Transaction) (agencies.AgencyAgent, error)
		RegisterAgencyAgent(c context.Context, agent agencies.AgencyAgent, tx interfaces.Transaction) (agencies.AgencyAgent, error)
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
