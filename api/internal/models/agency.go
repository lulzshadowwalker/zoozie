package models

import (
	"github.com/lulzshadowwalker/zooz/api/internal/database/.gen/zooz/public/model"
)

type Agency struct {
	model.Agencies
	model.AgenciesI18n
}
