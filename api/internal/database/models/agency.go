package models

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/model"
	"github.com/lulzshadowwalker/zoozie/api/internal/entity"
)

type Agency struct {
	Agency       model.Agencies
	Translations model.AgenciesI18n
}

func (m *Agency) ToEntity() *entity.Agency {
	return &entity.Agency{
		ID:           int(m.Agency.ID),
		PhoneNumber:  m.Agency.PhoneNumber,
		EmailAddress: m.Agency.EmailAddress,
		Slug:         m.Agency.Slug,
		LanguageCode: *m.Translations.LanguageCode,
		Name:         m.Translations.Name,
		Description:  m.Translations.Description,
	}
}
