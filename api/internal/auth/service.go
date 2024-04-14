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

	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies/otp"
	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/messaging"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	service struct {
		repo Repo
	}

	Repo interface {
		GetUserById(context.Context, int) (*users.User, error)
		GetUserByPhoneNumber(context.Context, entities.PhoneNumber) (*users.User, error)
		CreateCustomer(context.Context, customers.Customer) (customers.Customer, error)
		GetOTPByUserID(c context.Context, userID int) (otp.OTP, error)
		StoreOTP(context.Context, otp.OTP) (otp.OTP, error)
		UpdateOTP(c context.Context, otp otp.OTP) (otp.OTP, error)
		GetAgencyAgentByUserID(c context.Context, userID int) (agencies.AgencyAgent, error)
	}
)

func NewService(r Repo) *service {
	return &service{
		repo: r,
	}
}

func (s *service) Login(c context.Context, request loginRequest) (*users.User, error) {
	phoneNumber, err := entities.NewPhoneNumber(request.CountryCode, request.PhoneNumber)
	if err != nil {
		return nil, err
	}

	user, err := s.repo.GetUserByPhoneNumber(c, phoneNumber)
	if err != nil {
		return nil, err
	}

	err = checkUserActiveStatus(user)
	if err != nil {
		return nil, err
	}

	if err := s.verifyOTP(c, int(user.ID), request.OTP); err != nil {
		return nil, err
	}

	accessToken, refreshToken, err := s.generateTokenPair(c, user)
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

	user, err := s.repo.GetUserById(c, uid)
	if err != nil {
		return "", "", err
	}

	err = checkUserActiveStatus(user)
	if err != nil {
		return "", "", err
	}

	return s.generateTokenPair(c, user)
}

func (s *service) generateTokenPair(c context.Context, user *users.User) (accessToken, refreshToken string, err error) {
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
	if user.Role == "agency_agent" {
		agencyAgent, err := s.repo.GetAgencyAgentByUserID(c, int(user.ID))
		if err != nil {
			return "", "", err
		}

		customClaims.AgencyID = agencyAgent.AgencyID
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

func (s *service) RegisterCustomer(c context.Context, request registerCustomerRequest) (customers.Customer, error) {
	phoneNumber, err := entities.NewPhoneNumber(request.CountryCode, request.PhoneNumber)
	if err != nil {
		return customers.Customer{}, nil
	}

	customer := customers.Customer{
		User: users.User{
			EmailAddress:   request.EmailAddress,
			Name:           request.Name,
			PhoneNumber:    phoneNumber,
			ProfilePicture: &request.ProfilePicture,
		},
	}
	customer, err = s.repo.CreateCustomer(c, customer)
	if err != nil {
		return customers.Customer{}, err
	}

	err = s.sendOTP(c, int(customer.User.ID))
	if err != nil {
		return customers.Customer{}, err
	}

	accessToken, refreshToken, err := s.generateTokenPair(c, &customer.User)
	if err != nil {
		return customers.Customer{}, nil
	}
	customer.User.AccessToken = accessToken
	customer.User.RefreshToken = refreshToken
	return customer, nil
}

func checkUserActiveStatus(user *users.User) error {
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

func (s *service) VerifyOTP(c context.Context, prompt string) error {
	userID, err := utils.GetUserID(c)
	if err != nil {
		return err
	}

	return s.verifyOTP(c, userID, prompt)
}

func generateOTP(length int) string {
	const charset = "0123456789ABCDEFGHJKLMNOPQRSTUVWXYZ"
	otp := make([]byte, length)

	for i := range otp {
		otp[i] = charset[rand.Intn(len(charset))]
	}

	return string(otp)
}

func (s *service) SendOTP(c context.Context) error {
	userID, err := utils.GetUserID(c)
	if err != nil {
		return err
	}

	return s.sendOTP(c, userID)
}

func (s *service) sendOTP(c context.Context, userID int) error {
	user, err := s.repo.GetUserById(c, userID)
	if err != nil {
		return err
	}

	const otpLength = 4
	code := generateOTP(otpLength)

	e164PhoneNumber, err := entities.NewE164PhoneNumber(user.PhoneNumber.CountryCode, user.PhoneNumber.PhoneNumber)
	if err != nil {
		return err
	}
	err = messaging.SendSMS(c, e164PhoneNumber, fmt.Sprintf("Thank you for registering with Zoozie\nYour OTP code is %s", code))
	if err != nil {
		return fmt.Errorf("failed to send otp code because %w", err)
	}

	hashedCode, err := bcrypt.GenerateFromPassword([]byte(code), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash otp code because %w", err)
	}

	otp := otp.OTP{
		UserID: int(userID),
		Code:   string(hashedCode),
		SentAt: time.Now().UTC(),
	}

	_, err = s.repo.StoreOTP(c, otp)
	if err != nil {
		return err
	}

	return nil
}
