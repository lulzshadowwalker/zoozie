package services

import (
	"context"

	"github.com/lulzshadowwalker/zooz/api/internal/models"
)

type AgenciesService struct {
	repo AgenciesRepo
}

func NewAgenciesService(r AgenciesRepo) *AgenciesService {
  return &AgenciesService{
    repo: r,
  }
}

type AgenciesRepo interface {
	GetAgencies(context.Context) ([]*models.Agency, error)
  GetAgencyBySlug(c context.Context, slug string) (*models.Agency, error)
}

func (s *AgenciesService) GetAgencies(c context.Context) ([]*models.Agency, error) {
	return s.repo.GetAgencies(c)
}

func (s *AgenciesService) GetAgencyBySlug(c context.Context, slug string) (*models.Agency, error) {
  return s.repo.GetAgencyBySlug(c, slug)
}
