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
	GetAgencies(context.Context) ([]Agency, error)
	GetAgencyBySlug(c context.Context, slug string) (*Agency, error)
	CreateAgency(c context.Context, Agency Agency, tx interfaces.Transaction) (Agency, error)
	CreateAgencyI18n(c context.Context, i18n AgencyI18n, tx interfaces.Transaction) (AgencyI18n, error)
}

func (s *service) GetAgencies(c context.Context) ([]Agency, error) {
	return s.repo.GetAgencies(c)
}

func (s *service) GetAgencyBySlug(c context.Context, request getAgencyBySlugRequest) (*Agency, error) {
	return s.repo.GetAgencyBySlug(c, request.Slug)
}

func (s *service) CreateAgency(c context.Context, request createAgencyRequest) (Agency, error) {
	tx, err := s.repo.Begin(c)
	if err != nil {
		return Agency{}, fmt.Errorf("failed to start transaction because %w", err)
	}
	defer tx.Rollback()

	phoneNumber, err := entities.NewPhoneNumber(request.CountryCode, request.PhoneNumber)
	if err != nil {
		return Agency{}, err
	}

	agency := Agency{
		PhoneNumber:  phoneNumber,
		Logo:         request.Logo,
		EmailAddress: request.EmailAddress,
		Slug:         utils.GenerateSlug(request.EnglishName),
	}

	agency, err = s.repo.CreateAgency(c, agency, tx)
	if err != nil {
		return Agency{}, err
	}

	translations := []AgencyI18n{
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
			return Agency{}, err
		}
	}

	err = tx.Commit()
	if err != nil {
		return Agency{}, fmt.Errorf("failed to commit transaction because %w", err)
	}

	agency.Name = request.EnglishName
	agency.Description = request.EnglishDescription
	return agency, nil
}
