package services

import (
	"context"

	"github.com/lulzshadowwalker/zooz/api/internal/models"
)

type (
	AmenitiesService struct {
		repo AmenitiesRepo
	}

	AmenitiesRepo interface {
		GetAll(context.Context) ([]*models.Amenity, error)
	}
)

func NewAmenitiesService(repo AmenitiesRepo) *AmenitiesService {
	return &AmenitiesService{
		repo: repo,
	}
}

func (s *AmenitiesService) GetAll(c context.Context) ([]*models.Amenity, error) {
	return s.repo.GetAll(c)
}
