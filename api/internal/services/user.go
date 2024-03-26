package services

import (
	"context"
	"net/http"

	"github.com/lulzshadowwalker/zoozie/api/internal/models"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	UserService struct {
		repo UserRepo
	}

	UserRepo interface {
		GetUserById(context.Context, int) (*models.User, error)
	}
)

func NewUserService(r UserRepo) *UserService {
	return &UserService{
		repo: r,
	}
}

func (s *UserService) GetUserById(c context.Context, id int) (*models.User, error) {
	user, err := s.repo.GetUserById(c, id)
	if err != nil {
		return nil, err
	}

	if user.IsActive == nil {
		panic("users.is_active cannot be null")
	}

	if !*user.IsActive {
		return nil, utils.NewApiError(http.StatusForbidden, "user has been deactivated")
	}

	user.PasswordHash = ""
	return user, nil
}
