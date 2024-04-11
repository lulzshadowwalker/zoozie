package users

import (
	"context"
	"net/http"

	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	service struct {
		repo Repo
	}

	Repo interface {
		GetUserById(context.Context, int) (*User, error)
	}
)

func NewService(r Repo) *service {
	return &service{
		repo: r,
	}
}

func (s *service) GetUserById(c context.Context, id int) (*User, error) {
	user, err := s.repo.GetUserById(c, id)
	if err != nil {
		return nil, err
	}

	if !user.Active {
		return nil, utils.NewApiError(http.StatusForbidden, "user has been deactivated")
	}

	user.PasswordHash = ""
	return user, nil
}
