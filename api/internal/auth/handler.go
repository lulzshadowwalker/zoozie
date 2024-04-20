package auth

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/server/middleware"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	handler struct {
		service Service
	}

	Service interface {
		Login(c context.Context, request loginRequest) (*users.User, error)
		RefreshToken(c context.Context, token string) (accessToken, refreshToken string, err error)
		RegisterCustomer(c context.Context, request registerCustomerRequest) (customers.Customer, error)
		SendOTP(context.Context, sendOTPRequest) error
		VerifyOTP(context.Context, verifyOTPRequest) error
		RegisterAgencyAgent(context.Context, registerAgencyAgentRequest) (users.User, error)
	}
)

func NewHandler(s Service) *handler {
	return &handler{
		service: s,
	}
}

func (h *handler) RegisterRoutes(e *echo.Group) {
	auth := e.Group("/auth")
	auth.POST("/login", utils.Unwrap(h.Login))
	auth.POST("/refresh-token", utils.Unwrap(h.RefreshToken))
	auth.POST("/otp/send", utils.Unwrap(h.SendOTP), middleware.PreferAuth())
	auth.POST("/otp/verify", utils.Unwrap(h.VerifyOTP), middleware.PreferAuth())

	auth.POST(
		"/register/customer",
		utils.Unwrap(h.RegisterCustomer),
		echoMiddleware.BodyLimit("4M"),
	)
	auth.POST(
		"/register/agent", utils.Unwrap(h.RegisterAgencyAgent),

		// TODO: add a profile picture
		// middleware.WithZoozieAdmin,
	)
}

func (h *handler) Login(c echo.Context) error {
	var request loginRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	user, err := h.service.Login(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"user": echo.Map{
				"accessToken":  user.AccessToken,
				"refreshToken": user.RefreshToken,
			},
		},
	})
}

func (h *handler) RefreshToken(c echo.Context) error {
	type Request struct {
		RefreshToken string `json:"refreshToken" form:"refreshToken" validate:"required"`
	}

	var request Request
	if err := c.Bind(&request); err != nil {
		return err
	}

	if err := c.Validate(request); err != nil {
		return err
	}

	accessToken, refreshToken, err := h.service.RefreshToken(utils.TransformEchoContext(c), request.RefreshToken)
	if err != nil {
		return err
	}

	h.setCookies(c, accessToken, refreshToken)

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"accessToken":  accessToken,
			"refreshToken": refreshToken,
		},
	})
}

func (h *handler) RegisterCustomer(c echo.Context) error {
	var request registerCustomerRequest
	if err := c.Bind(&request); err != nil {
		return err
	}

	if err := c.Validate(&request); err != nil {
		return err
	}

	profilePicture, err := c.FormFile("profilePicture")
	if err != nil {
		if errors.Is(err, http.ErrContentLength) {
			return c.JSON(http.StatusBadRequest, echo.Map{"message": "profilePicture file is too large"})
		}

		return fmt.Errorf("failed to get profilePicture because %w", err)
	}
	request.ProfilePicture = profilePicture

	customer, err := h.service.RegisterCustomer(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"message": "OTP has been sent to your phone number",
		"data": echo.Map{
			"user": echo.Map{
				"accessToken":  customer.AccessToken,
				"refreshToken": customer.RefreshToken,
			},
		},
	})
}

func (h *handler) SendOTP(c echo.Context) error {
	var request sendOTPRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	_, err := utils.GetUserID(utils.TransformEchoContext(c))
	if err != nil {
		if request.CountryCode == "" || request.PhoneNumber == "" {
			return c.JSON(http.StatusBadRequest, echo.Map{"message": "either provide an access token or country code and phone number"})
		}
	}

	err = h.service.SendOTP(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "OTP has been sent to your phone number"})
}

func (h *handler) VerifyOTP(c echo.Context) error {
	var request verifyOTPRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	_, err := utils.GetUserID(utils.TransformEchoContext(c))
	if err != nil {
		if request.CountryCode == "" || request.PhoneNumber == "" {
			return c.JSON(http.StatusBadRequest, echo.Map{"message": "either provide an access token or country code and phone number"})
		}
	}

	err = h.service.VerifyOTP(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "OTP verified successfully"})
}

func (h *handler) RegisterAgencyAgent(c echo.Context) error {
	var request registerAgencyAgentRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	user, err := h.service.RegisterAgencyAgent(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"user": echo.Map{
				"accessToken":  user.AccessToken,
				"refreshToken": user.RefreshToken,
			},
		},
		"message": "OTP has been sent to your phone number",
	})
}

func (h *handler) setCookies(c echo.Context, accessToken, refreshToken string) {
	accessTokenCookie := http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		HttpOnly: true,
		Secure:   true,
		Expires:  time.Now().Add(time.Hour * 24 * 30),
	}

	refreshTokenCookie := http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		Secure:   true,
		Expires:  time.Now().Add(time.Hour * 24 * 30),
	}

	c.SetCookie(&accessTokenCookie)
	c.SetCookie(&refreshTokenCookie)
}
