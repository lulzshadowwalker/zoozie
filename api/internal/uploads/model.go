package uploads

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/model"
)

type DBUpload struct {
	Upload model.Uploads
}

func (u *DBUpload) ToEntity() Upload {
	return Upload{
		ID:               int(u.Upload.ID),
		File:             u.Upload.File,
		FileType:         u.Upload.FileType,
		OriginalFileName: *u.Upload.OriginalFileName,
		UploadedBy:       int(u.Upload.UserID),
	}
}
