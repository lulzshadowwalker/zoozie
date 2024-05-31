package auth

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/otp"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	service struct {
		repo Repo
	}

	Repo interface {
		interfaces.Transactioner
		GetUserById(context.Context, int, interfaces.Transaction) (*entities.User, error)
		GetUserByPhoneNumber(context.Context, entities.PhoneNumber) (*entities.User, error)
		GetAgencyByID(c context.Context, id int, tx interfaces.Transaction) (*entities.Agency, error)
		GetCustomerByUserID(c context.Context, userID int, tx interfaces.Transaction) (customers.Customer, error)

		// TODO: use a transaction to the create the customer and other things ..
		CreateCustomer(context.Context, customers.Customer, interfaces.Transaction) (customers.Customer, error)
		CreateUser(context.Context, entities.User, interfaces.Transaction) (entities.User, error)
		GetOTPByUserID(c context.Context, userID int) (otp.OTP, error)
		StoreOTP(context.Context, otp.OTP, interfaces.Transaction) (otp.OTP, error)
		UpdateOTP(c context.Context, otp otp.OTP) (otp.OTP, error)
		GetAgencyAgentByUserID(c context.Context, userID int, tx interfaces.Transaction) (entities.AgencyAgent, error)
		RegisterAgencyAgent(c context.Context, agent entities.AgencyAgent, tx interfaces.Transaction) (entities.AgencyAgent, error)
	}
)

func NewService(r Repo) *service {
	return &service{
		repo: r,
	}
}

func (s *service) Login(c context.Context, request loginRequest) (*entities.User, error) {
	phoneNumber, err := entities.NewPhoneNumber(request.CountryCode, request.PhoneNumber)
	if err != nil {
		return nil, err
	}

	user, err := s.repo.GetUserByPhoneNumber(c, phoneNumber)
	if err != nil {
		return nil, err
	}

	expandedUser, err := s.expandUser(c, *user)
	if err != nil {
		return nil, err
	}
	user = &expandedUser

	err = checkUserActiveStatus(user)
	if err != nil {
		return nil, err
	}

	if err := s.verifyOTP(c, int(user.ID), request.OTP); err != nil {
		return nil, err
	}

	accessToken, refreshToken, err := s.generateTokenPair(c, *user)
	if err != nil {
		return nil, err
	}

	user.AccessToken = accessToken
	user.RefreshToken = refreshToken
	return user, nil
}

func (s *service) RefreshToken(c context.Context, token string) (accessToken, refreshToken string, err error) {
	t, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok || err != nil {
			return nil, utils.NewApiError(http.StatusUnauthorized, "invalid token")
		}

		return []byte(config.GetJwtSecret()), nil
	})

	claims, ok := t.Claims.(jwt.MapClaims)
	if !ok {
		return "", "", fmt.Errorf("unexpected token claims type")
	}

	if !t.Valid {
		return "", "", utils.NewApiError(http.StatusUnauthorized, "invalid token")
	}

	uid, err := strconv.Atoi(claims["sub"].(string))
	if err != nil {
		return "", "", fmt.Errorf("failed to parse the user id because %w", err)
	}

	user, err := s.repo.GetUserById(c, uid, nil)
	if err != nil {
		return "", "", err
	}

	err = checkUserActiveStatus(user)
	if err != nil {
		return "", "", err
	}

	return s.generateTokenPair(c, *user)
}

func (s *service) RegisterCustomer(c context.Context, request registerCustomerRequest) (entities.User, error) {
	tx, err := s.repo.Begin(c)
	if err != nil {
		return entities.User{}, nil
	}
	defer tx.Rollback()

	phoneNumber, err := entities.NewPhoneNumber(request.CountryCode, request.PhoneNumber)
	if err != nil {
		return entities.User{}, nil
	}

	user := entities.User{
		EmailAddress: request.EmailAddress,
		Name:         request.Name,
		PhoneNumber:  &phoneNumber,
		Role:         entities.RoleCustomer,
	}

	if request.ProfilePicture != nil {
		uploadInfo, err := utils.StoreFile(request.ProfilePicture)
		if err == nil {
			user.ProfilePicture = &uploadInfo.Path
		}

		if !errors.Is(err, utils.ErrEmptyFile) {
			return entities.User{}, err
		}

	}
	user, err = s.repo.CreateUser(c, user, tx)
	if err != nil {
		return entities.User{}, err
	}

	customer := customers.Customer{UserID: int(user.ID)}
	customer, err = s.repo.CreateCustomer(c, customer, tx)
	if err != nil {
		return entities.User{}, err
	}
	user.Customer = &customer

	err = s.sendOTP(c, int(user.ID), tx)
	if err != nil {
		return entities.User{}, err
	}

	accessToken, refreshToken, err := s.generateTokenPair(c, user)
	if err != nil {
		return entities.User{}, err
	}
	if err = tx.Commit(); err != nil {
		return entities.User{}, fmt.Errorf("failed to commit transaction: %w", err)
	}

	user.AccessToken = accessToken
	user.RefreshToken = refreshToken
	return user, nil
}

func checkUserActiveStatus(user *entities.User) error {
	if !user.Active {
		return utils.NewApiError(http.StatusForbidden, "user has been deactivated")
	}

	return nil
}

func (s *service) verifyOTP(c context.Context, userID int, prompt string) error {
	otp, err := s.repo.GetOTPByUserID(c, userID)
	if err != nil {
		return err
	}

	// OTP expires in 2 minutes
	if otp.SentAt.UTC().Add(time.Minute * 2).Before(time.Now().UTC()) {
		return utils.NewApiError(http.StatusForbidden, "OTP has expired")
	}

	if otp.VerifiedAt != nil {
		return utils.NewApiError(http.StatusForbidden, "OTP has already been used")
	}

	prompt = strings.ToUpper(prompt)
	err = bcrypt.CompareHashAndPassword([]byte(otp.Code), []byte(prompt))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return utils.NewApiError(http.StatusUnauthorized, "invalid OTP")
		}

		return err
	}

	now := time.Now().UTC()
	otp.VerifiedAt = &now
	_, err = s.repo.UpdateOTP(c, otp)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) VerifyOTP(c context.Context, request verifyOTPRequest) error {
	var userID int
	if request.CountryCode == "" {
		uid, err := utils.GetUserID(c)
		if err != nil {
			return err
		}

		userID = uid
	} else {
		phone, err := entities.NewPhoneNumber(request.CountryCode, request.PhoneNumber)
		if err != nil {
			return err
		}

		user, err := s.repo.GetUserByPhoneNumber(c, phone)
		if err != nil {
			return err
		}
		userID = int(user.ID)
	}

	return s.verifyOTP(c, userID, request.OTP)
}

func generateOTP(length int) string {
	const charset = "0123456789ABCDEFGHJKLMNOPQRSTUVWXYZ"
	otp := make([]byte, length)

	for i := range otp {
		otp[i] = charset[rand.Intn(len(charset))]
	}

	return string(otp)
}

func (s *service) SendOTP(c context.Context, request sendOTPRequest) error {
	var userID int
	if request.CountryCode == "" {
		uid, err := utils.GetUserID(c)
		if err != nil {
			return err
		}

		userID = uid
	} else {
		phone, err := entities.NewPhoneNumber(request.CountryCode, request.PhoneNumber)
		if err != nil {
			return err
		}

		user, err := s.repo.GetUserByPhoneNumber(c, phone)
		if err != nil {
			return err
		}
		userID = int(user.ID)

	}

	return s.sendOTP(c, userID, nil)
}

func (s *service) sendOTP(c context.Context, userID int, tx interfaces.Transaction) error {
	// user, err := s.repo.GetUserById(c, userID, tx)
	// if err != nil {
	// 	return err
	// }

	// const otpLength = 4
	// code := generateOTP(otpLength)
	code := "1234"

	// e164PhoneNumber, err := entities.NewE164PhoneNumber(user.PhoneNumber.CountryCode, user.PhoneNumber.PhoneNumber)
	// if err != nil {
	// 	return err
	// }
	// err = messaging.SendSMS(c, e164PhoneNumber, fmt.Sprintf("Your OTP code is %s", code))
	// if err != nil {
	// 	return fmt.Errorf("failed to send otp code because %w", err)
	// }

	hashedCode, err := bcrypt.GenerateFromPassword([]byte(code), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash otp code because %w", err)
	}

	otp := otp.OTP{
		UserID: int(userID),
		Code:   string(hashedCode),
		SentAt: time.Now().UTC(),
	}

	_, err = s.repo.StoreOTP(c, otp, tx)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) RegisterAgencyAgent(c context.Context, request registerAgencyAgentRequest) (entities.User, error) {
	tx, err := s.repo.Begin(c)
	if err != nil {
		return entities.User{}, nil
	}
	defer tx.Rollback()

	phoneNumber, err := entities.NewPhoneNumber(request.CountryCode, request.PhoneNumber)
	if err != nil {
		return entities.User{}, nil
	}

	user := entities.User{
		EmailAddress:   request.EmailAddress,
		Name:           request.Name,
		PhoneNumber:    &phoneNumber,
		ProfilePicture: &request.ProfilePicture,
		Role:           entities.RoleAgencyAgent,
	}

	user, err = s.repo.CreateUser(c, user, tx)
	if err != nil {
		return entities.User{}, err
	}

	agent := entities.AgencyAgent{
		UserID:   int(user.ID),
		AgencyID: request.AgencyID,
	}

	agent, err = s.repo.RegisterAgencyAgent(c, agent, tx)
	if err != nil {
		return entities.User{}, err
	}
	user.Agent = &agent

	agency, err := s.repo.GetAgencyByID(c, request.AgencyID, tx)
	if err != nil {
		return entities.User{}, err
	}
	user.Agent.Agency = agency

	err = s.sendOTP(c, int(user.ID), tx)
	if err != nil {
		return entities.User{}, err
	}

	accessToken, refreshToken, err := s.generateTokenPair(c, user)
	if err != nil {
		return entities.User{}, err
	}

	if err = tx.Commit(); err != nil {
		return entities.User{}, fmt.Errorf("failed to commit transaction: %w", err)
	}
	user.AccessToken = accessToken
	user.RefreshToken = refreshToken
	return user, nil
}

func (s *service) generateTokenPair(_ context.Context, user entities.User) (accessToken, refreshToken string, err error) {
	uid := strconv.Itoa(int(user.ID))
	customClaims := entities.JwtCustomClaims{
		Name: user.Name,
		Role: user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject: uid,
			// TODO: FIXME: set access_token expiration for production
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 42069)),
		},
	}

	if user.Role == entities.RoleAgencyAgent {
		if user.Agent == nil {
			err = fmt.Errorf("user.AgencyAgent cannot be null when role is %s", user.Role)
			return
		}

		customClaims.AgencyID = user.Agent.AgencyID
		if user.Agent.Agency == nil {
			err = fmt.Errorf("user.Agent.Agency cannot be null when role is %s", user.Role)
			return
		}

		customClaims.AgencySlug = user.Agent.Agency.Slug
	} else if user.Role == entities.RoleCustomer {
		if user.Customer == nil {
			err = fmt.Errorf("user.Customer cannot be null when role is %s", user.Role)
			return
		}

		customClaims.CustomerID = user.Customer.ID
	}

	accessTok := jwt.NewWithClaims(jwt.SigningMethodHS256, customClaims)

	accessToken, err = accessTok.SignedString([]byte(config.GetJwtSecret()))
	if err != nil {
		err = fmt.Errorf("failed to sign the access token because %w", err)
		return
	}

	refreshTok := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Subject:   uid,
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
	},
	)

	refreshToken, err = refreshTok.SignedString([]byte(config.GetJwtSecret()))
	if err != nil {
		err = fmt.Errorf("failed to sign the access token because %w", err)
		return
	}

	return
}

func (s *service) expandUser(c context.Context, user entities.User) (entities.User, error) {
	if user.Role == entities.RoleCustomer {
		customer, err := s.repo.GetCustomerByUserID(c, int(user.ID), nil)
		if err != nil {
			return entities.User{}, err
		}

		user.Customer = &customer
	}

	if user.Role == entities.RoleAgencyAgent {
		agent, err := s.repo.GetAgencyAgentByUserID(c, int(user.ID), nil)
		if err != nil {
			return entities.User{}, err
		}

		user.Agent = &agent

		agency, err := s.repo.GetAgencyByID(c, agent.AgencyID, nil)
		if err != nil {
			return entities.User{}, err
		}

		user.Agent.Agency = agency
	}

	return user, nil
}
