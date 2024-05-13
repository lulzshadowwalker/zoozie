package agencies

import (
	"context"
	"fmt"

	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
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
	interfaces.Transactioner
	GetAgencies(context.Context) ([]entities.Agency, error)
	GetAgencyBySlug(c context.Context, slug string) (*entities.Agency, error)
	CreateAgency(c context.Context, agency entities.Agency, tx interfaces.Transaction) (entities.Agency, error)
	CreateAgencyI18n(c context.Context, i18n entities.AgencyI18n, tx interfaces.Transaction) (entities.AgencyI18n, error)
	GetAgencyReviews(c context.Context, id int, tx interfaces.Transaction) ([]entities.AgencyReview, error)
	CreateAgencyReview(c context.Context, review entities.AgencyReview, tx interfaces.Transaction) (entities.AgencyReview, error)
	ToggleAgencyFollow(c context.Context, customerID, agencyID int, tx interfaces.Transaction) (bool, error)
}

func (s *service) GetAgencies(c context.Context) ([]entities.Agency, error) {
	return s.repo.GetAgencies(c)
}

func (s *service) GetAgencyBySlug(c context.Context, request getAgencyBySlugRequest) (*entities.Agency, error) {
	return s.repo.GetAgencyBySlug(c, request.Slug)
}

func (s *service) CreateAgency(c context.Context, request createAgencyRequest) (entities.Agency, error) {
	tx, err := s.repo.Begin(c)
	if err != nil {
		return entities.Agency{}, fmt.Errorf("failed to start transaction because %w", err)
	}
	defer tx.Rollback()

	phoneNumber, err := entities.NewPhoneNumber(request.CountryCode, request.PhoneNumber)
	if err != nil {
		return entities.Agency{}, err
	}

	agency := entities.Agency{
		PhoneNumber:  phoneNumber,
		Logo:         request.Logo,
		EmailAddress: request.EmailAddress,
		Slug:         utils.GenerateSlug(request.EnglishName),
	}

	agency, err = s.repo.CreateAgency(c, agency, tx)
	if err != nil {
		return entities.Agency{}, err
	}

	translations := []entities.AgencyI18n{
		{
			AgencyID:     agency.ID,
			LanguageCode: "en",
			Name:         request.EnglishName,
			Description:  request.EnglishDescription,
		},
		{
			AgencyID:     agency.ID,
			LanguageCode: "ar",
			Name:         request.ArabicName,
			Description:  request.ArabicDescription,
		},
	}

	for _, translation := range translations {
		translation.AgencyID = agency.ID
		_, err = s.repo.CreateAgencyI18n(c, translation, tx)
		if err != nil {
			return entities.Agency{}, err
		}
	}

	err = tx.Commit()
	if err != nil {
		return entities.Agency{}, fmt.Errorf("failed to commit transaction because %w", err)
	}

	agency.Name = request.EnglishName
	agency.Description = request.EnglishDescription
	return agency, nil
}

func (s *service) GetAgencyReviews(c context.Context, request getAgencyReviewsRequest) ([]entities.AgencyReview, error) {
	return s.repo.GetAgencyReviews(c, request.ID, nil)
}

func (s *service) CreateAgencyReview(c context.Context, request createAgencyReviewRequest) (entities.AgencyReview, error) {
	customerID, err := utils.GetCustomerID(c)
	if err != nil {
		return entities.AgencyReview{}, err
	}

	review := entities.AgencyReview{
		AgencyID:   request.AgencyID,
		CustomerID: customerID,
		Content:    request.Content,
		Rating:     request.Rating,
	}

	return s.repo.CreateAgencyReview(c, review, nil)
}

func (s *service) ToggleAgencyFollowRequest(c context.Context, request toggleAgencyFollowRequest) (bool, error) {
	customerID, err := utils.GetCustomerID(c)
	if err != nil {
		return false, err
	}

	return s.repo.ToggleAgencyFollow(c, customerID, request.AgencyID, nil)
}
