package listings

import (
	"context"
)

type (
	service struct {
		repo Repo
	}

	Repo interface {
		CreateListing(context.Context, Listing) (Listing, error)
		GetListing(c context.Context, id int) (Listing, error)
		GetAllListings(c context.Context) ([]Listing, error)
	}
)

func NewService(repo Repo) *service {
	return &service{repo: repo}
}

func (s *service) CreateListing(c context.Context, listing createListingRequest) (Listing, error) {
	entity := listing.ToEntity()
	// TODO: check for required coreListingFeatures

	return s.repo.CreateListing(c, entity)
}

func (s *service) GetListing(c context.Context, request getListingRequest) (Listing, error) {
	return s.repo.GetListing(c, request.ID)
}

func (s *service) GetAllListings(c context.Context) ([]Listing, error) {
	return s.repo.GetAllListings(c)
}
