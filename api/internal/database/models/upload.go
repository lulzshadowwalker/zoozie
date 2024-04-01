package models

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/model"
	"github.com/lulzshadowwalker/zoozie/api/internal/entity"
)

type Upload struct {
	Upload model.Uploads
}

func (u *Upload) ToEntity() entity.Upload {
	return entity.Upload{
		ID:               int(u.Upload.ID),
		File:             u.Upload.File,
		FileType:         u.Upload.FileType,
		OriginalFileName: *u.Upload.OriginalFileName,
		UploadedBy:       int(u.Upload.UserID),
	}
}
