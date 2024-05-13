package otp

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
)

type DBOTP struct {
	OTP model.Otps
}

func (o *DBOTP) ToEntity() OTP {
	return OTP{
		ID:         int(o.OTP.ID),
		UserID:     int(o.OTP.UserID),
		Code:       o.OTP.Code,
		VerifiedAt: o.OTP.VerifiedAt,
		SentAt:     o.OTP.SentAt,
	}
}
