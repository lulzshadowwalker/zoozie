package services

import (
	"context"

	"github.com/lulzshadowwalker/zoozie/api/internal/dto"
	"github.com/lulzshadowwalker/zoozie/api/internal/models"
)

type (
	ListingsService struct {
		repo ListingsRepo
	}

	ListingsRepo interface {
		CreateListing(context.Context, models.Listing) (models.Listing, error)
	}
)

func NewListingsService(repo ListingsRepo) *ListingsService {
	return &ListingsService{repo: repo}
}

func (s *ListingsService) CreateListing(c context.Context, listing dto.CreateListingRequest) (models.Listing, error) {
	entity := listing.ToEntity()

	// TODO: check for required coreListingFeatures

	return s.repo.CreateListing(c, entity)
}
