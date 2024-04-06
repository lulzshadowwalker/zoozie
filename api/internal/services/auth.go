package services

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/lulzshadowwalker/zoozie/api/internal/entity"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

// NOTE: This is probably broken as of right now for replacing entity.User with users.User

type (
	AuthService struct {
		repo AuthRepo
	}

	AuthRepo interface {
		GetUserByEmail(context.Context, string) (*users.User, error)
		GetUserById(context.Context, int) (*users.User, error)
	}
)

func NewAuthService(r AuthRepo) *AuthService {
	return &AuthService{
		repo: r,
	}
}

func (s *AuthService) Login(c context.Context, email, password string) (*users.User, error) {
	user, err := s.repo.GetUserByEmail(c, email)
	if err != nil {
		return nil, err
	}

	err = checkUserActiveStatus(user)
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return nil, utils.NewApiError(http.StatusUnauthorized, "invalid credentials")
	}

	accessToken, refreshToken, err := s.generateTokenPair(user)
	if err != nil {
		return nil, err
	}

	user.PasswordHash = ""
	user.AccessToken = accessToken
	user.RefreshToken = refreshToken
	return user, nil
}

func (s *AuthService) RefreshToken(c context.Context, token string) (accessToken, refreshToken string, err error) {
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

	return s.generateTokenPair(user)
}

func (s *AuthService) generateTokenPair(user *users.User) (accessToken, refreshToken string, err error) {
	name := "lulzie"
	if user.Name != nil {
		name = *user.Name
	}

	uid := strconv.Itoa(int(user.ID))
	accessTok := jwt.NewWithClaims(jwt.SigningMethodHS256, entity.JwtCustomClaims{
		name,
		jwt.RegisteredClaims{
			Subject: uid,
			// TODO: FIXME: set access_token expiration for production
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 42069)),
		},
	})

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

func checkUserActiveStatus(user *users.User) error {
	isActive := user.IsActive
	if isActive == nil {
		panic("users.is_active cannot be null")
	}

	if !*isActive {
		return utils.NewApiError(http.StatusForbidden, "user has been deactivated")
	}

	return nil
}
