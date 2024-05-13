package agencies

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
)

type dbAgency struct {
	Agency       model.Agencies
	PhoneNumber  model.AgencyPhoneNumbers
	Translations model.AgenciesI18n

	Following bool `alias:"following"`
}

func (m *dbAgency) ToEntity() (entities.Agency, error) {
	phoneNumber, err := entities.NewPhoneNumber(m.PhoneNumber.CountryCode, m.PhoneNumber.PhoneNumber)
	if err != nil {
		return entities.Agency{}, err
	}

	return entities.Agency{
		ID:           int(m.Agency.ID),
		PhoneNumber:  phoneNumber,
		EmailAddress: m.Agency.EmailAddress,
		Slug:         m.Agency.Slug,
		Logo:         m.Agency.Logo,
		Name:         m.Translations.Name,
		Description:  m.Translations.Description,
		Following:    m.Following,
	}, nil
}

type DBAgencyAgent struct {
	AgencyAgent model.AgencyAgents
}

func (m *DBAgencyAgent) ToEntity() entities.AgencyAgent {
	return entities.AgencyAgent{
		ID:       int(m.AgencyAgent.ID),
		UserID:   int(m.AgencyAgent.UserID),
		AgencyID: int(m.AgencyAgent.AgencyID),
	}
}

type DBAgencyReview struct {
	Review   model.AgencyReviews
	Customer *model.Customers
	User     *model.Users
}

func (m *DBAgencyReview) ToEntity() entities.AgencyReview {
	review := entities.AgencyReview{
		ID:         int(m.Review.ID),
		AgencyID:   int(m.Review.AgencyID),
		CustomerID: int(m.Review.CustomerID),
		Content:    m.Review.Content,
		Rating:     int(m.Review.Rating),
		CreatedAt:  m.Review.CreatedAt,
		UpdateAt:   m.Review.UpdatedAt,
	}

	if m.User != nil {
		user := &entities.User{
			ID:             m.User.ID,
			Name:           m.User.Name,
			ProfilePicture: m.User.ProfilePicture,
			EmailAddress:   m.User.EmailAddress,
		}

		if m.Customer != nil {
			user.Customer =
				&customers.Customer{
					ID:     int(m.Customer.ID),
					UserID: int(m.Customer.UserID),
				}
		}

		review.Customer = user
	}

	return review
}
