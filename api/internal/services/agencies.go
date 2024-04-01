package services

import (
	"context"

	"github.com/lulzshadowwalker/zoozie/api/internal/dto"
	"github.com/lulzshadowwalker/zoozie/api/internal/entity"
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
	GetAgencies(context.Context) ([]*entity.Agency, error)
	GetAgencyBySlug(c context.Context, slug string) (*entity.Agency, error)
}

func (s *AgenciesService) GetAgencies(c context.Context) ([]*entity.Agency, error) {
	return s.repo.GetAgencies(c)
}

func (s *AgenciesService) GetAgencyBySlug(c context.Context, request dto.GetAgencyBySlugRequest) (*entity.Agency, error) {
	return s.repo.GetAgencyBySlug(c, request.Slug)
}
