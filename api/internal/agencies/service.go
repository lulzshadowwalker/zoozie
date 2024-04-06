package agencies

import (
	"context"
)

type service struct {
	repo Repo
}

func NewService(r Repo) *service {
	return &service{
		repo: r,
	}
}

type Repo interface {
	GetAgencies(context.Context) ([]*Agency, error)
	GetAgencyBySlug(c context.Context, slug string) (*Agency, error)
}

func (s *service) GetAgencies(c context.Context) ([]*Agency, error) {
	return s.repo.GetAgencies(c)
}

func (s *service) GetAgencyBySlug(c context.Context, request getAgencyBySlugRequest) (*Agency, error) {
	return s.repo.GetAgencyBySlug(c, request.Slug)
}
