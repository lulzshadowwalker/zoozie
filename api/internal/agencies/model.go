package agencies

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
)

type dbAgency struct {
	Agency       model.Agencies
	PhoneNumber  model.AgencyPhoneNumbers
	Translations model.AgenciesI18n
}

func (m *dbAgency) ToEntity() (Agency, error) {
	phoneNumber, err := entities.NewPhoneNumber(m.PhoneNumber.CountryCode, m.PhoneNumber.PhoneNumber)
	if err != nil {
		return Agency{}, err
	}

	return Agency{
		ID:           int(m.Agency.ID),
		PhoneNumber:  phoneNumber,
		EmailAddress: m.Agency.EmailAddress,
		Slug:         m.Agency.Slug,
		Logo:         m.Agency.Logo,
		Name:         m.Translations.Name,
		Description:  m.Translations.Description,
	}, nil
}

type DBAgencyAgent struct {
	AgencyAgent model.AgencyAgents
}

func (m *DBAgencyAgent) ToEntity() AgencyAgent {
	return AgencyAgent{
		ID:       int(m.AgencyAgent.ID),
		UserID:   int(m.AgencyAgent.UserID),
		AgencyID: int(m.AgencyAgent.AgencyID),
	}
}
