package models

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/model"
)

type Agency struct {
	model.Agencies
	model.AgenciesI18n
}
