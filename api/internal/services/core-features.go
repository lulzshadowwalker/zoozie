package services

import (
	"context"

	"github.com/lulzshadowwalker/zoozie/api/internal/models"
)

type (
	CoreFeaturesService struct {
		repo CoreFeaturesRepo
	}

	CoreFeaturesRepo interface {
		GetAll(context.Context) ([]*models.CoreFeature, error)
	}
)

func NewCoreFeaturesService(repo CoreFeaturesRepo) *CoreFeaturesService {
	return &CoreFeaturesService{
		repo: repo,
	}
}

func (s *CoreFeaturesService) GetAll(c context.Context) ([]*models.CoreFeature, error) {
	return s.repo.GetAll(c)
}
