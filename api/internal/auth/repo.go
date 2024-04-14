package auth

import (
	"context"
	"database/sql"

	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies/otp"
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
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
		GetUserByPhoneNumber(context.Context, entities.PhoneNumber) (*users.User, error)
		GetUserById(context.Context, int) (*users.User, error)
	}

	customersRepo interface {
		CreateCustomer(context.Context, customers.Customer) (customers.Customer, error)
	}

	otpRepo interface {
		StoreOTP(context.Context, otp.OTP) (otp.OTP, error)
		GetOTPByUserID(c context.Context, userID int) (otp.OTP, error)
		UpdateOTP(c context.Context, otp otp.OTP) (otp.OTP, error)
	}

	agenciesRepo interface {
		GetAgencyAgentByUserID(c context.Context, userID int) (agencies.AgencyAgent, error)
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
