package agencies

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
)

type dbAgency struct {
	Agency       model.Agencies
	Translations model.AgenciesI18n
}

func (m *dbAgency) ToEntity() *Agency {
	return &Agency{
		ID:           int(m.Agency.ID),
		PhoneNumber:  m.Agency.PhoneNumber,
		EmailAddress: m.Agency.EmailAddress,
		Slug:         m.Agency.Slug,
		Logo:         m.Agency.Logo,
		Name:         m.Translations.Name,
		Description:  m.Translations.Description,
	}
}
