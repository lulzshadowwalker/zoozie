package otp

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type repo struct {
	database *sql.DB
}

func NewRepo(database *sql.DB) *repo {
	return &repo{database}
}

func (r *repo) StoreOTP(ctx context.Context, otp OTP, tx interfaces.Transaction) (OTP, error) {
	var dbOTP DBOTP
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}
	err := Otps.INSERT(
		Otps.UserID,
		Otps.Code,
		Otps.SentAt,
	).
		VALUES(
			otp.UserID,
			otp.Code,
			otp.SentAt,
		).
		RETURNING(Otps.AllColumns).
		QueryContext(ctx, db, &dbOTP)
	if err != nil {
		return OTP{}, fmt.Errorf("failed to insert otp because %w", err)
	}

	return dbOTP.ToEntity(), nil
}

func (r *repo) GetOTPByUserID(c context.Context, userID int) (OTP, error) {
	var dbOTP DBOTP
	err := Otps.SELECT(Otps.AllColumns).
		WHERE(Otps.UserID.EQ(postgres.Int(int64(userID)))).
		ORDER_BY(Otps.CreatedAt.DESC()).
		QueryContext(c, r.database, &dbOTP)
	if err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return OTP{}, utils.NewApiError(http.StatusNotFound, "user doesn't have any otp sessions")
		}

		return OTP{}, err
	}

	return dbOTP.ToEntity(), nil
}

func (r *repo) UpdateOTP(c context.Context, otp OTP) (OTP, error) {
	_, err := Otps.UPDATE(
		Otps.VerifiedAt,
	).
		SET(otp.VerifiedAt).
		WHERE(Otps.ID.EQ(postgres.Int(int64(otp.ID)))).
		ExecContext(c, r.database)
	if err != nil {
		return OTP{}, err
	}

	return otp, nil
}
