package services

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/lulzshadowwalker/zooz/api/internal/config"
	"github.com/lulzshadowwalker/zooz/api/internal/models"
	"github.com/lulzshadowwalker/zooz/api/internal/utils"
)

type (
	AuthService struct {
		repo AuthRepo
	}

	AuthRepo interface {
  GetUserByEmail(context.Context, string) (*models.User, error)
  GetUserById(context.Context, int) (*models.User, error)
	}

	JwtCustomClaims struct {
		Name string `json:"name"`
		jwt.RegisteredClaims
	}
)

func NewAuthService(r AuthRepo) *AuthService {
	return &AuthService{
		repo: r,
	}
}

func (s *AuthService) Login(c context.Context, email, password string) (*models.User, error) {
	user, err := s.repo.GetUserByEmail(c, email)
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
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, utils.NewApiError(http.StatusUnauthorized, "invalid token")
		}

		return []byte(config.GetJwtSecret()), nil
	})
	if err != nil {
		return "", "", fmt.Errorf("failed to parse the token because %w", err)
	}

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


  isActive := user.IsActive
  if isActive == nil {
    return "", "", fmt.Errorf("users.is_active cannot be null")
  }

	if !*isActive {
		return "", "", utils.NewApiError(http.StatusForbidden, "user has been deactivated")
	}

	return s.generateTokenPair(user)
}

func (s *AuthService) generateTokenPair(user *models.User) (accessToken, refreshToken string, err error) {
	name := "lulzie"
	if user.Name != nil {
		name = *user.Name
	}

	uid := strconv.Itoa(int(user.ID))
	accessTok := jwt.NewWithClaims(jwt.SigningMethodHS256, JwtCustomClaims{
		name,
		jwt.RegisteredClaims{
			Subject:   uid,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 15)),
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
