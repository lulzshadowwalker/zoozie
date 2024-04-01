package services

import (
	"context"

	"github.com/lulzshadowwalker/zoozie/api/internal/dto"
	"github.com/lulzshadowwalker/zoozie/api/internal/entity"
)

type (
	ListingsService struct {
		repo ListingsRepo
	}

	ListingsRepo interface {
		CreateListing(context.Context, entity.Listing) (entity.Listing, error)
		GetListing(c context.Context, id int) (entity.Listing, error)
		GetAllListings(c context.Context) ([]entity.Listing, error)
	}
)

func NewListingsService(repo ListingsRepo) *ListingsService {
	return &ListingsService{repo: repo}
}

func (s *ListingsService) CreateListing(c context.Context, listing dto.CreateListingRequest) (entity.Listing, error) {
	entity := listing.ToEntity()
	// TODO: check for required coreListingFeatures

	return s.repo.CreateListing(c, entity)
}

func (s *ListingsService) GetListing(c context.Context, request dto.GetListingRequest) (entity.Listing, error) {
	return s.repo.GetListing(c, request.ID)
}

func (s *ListingsService) GetAllListings(c context.Context) ([]entity.Listing, error) {
	return s.repo.GetAllListings(c)
}
