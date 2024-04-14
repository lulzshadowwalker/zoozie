package messaging

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/twilio/twilio-go"
	twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
)

var (
	sourcePhoneNumber string
	client            *twilio.RestClient
)

func init() {
	if accountSID := config.TwilioGetAccountSID(); accountSID == "" {
		log.Fatalf("Twilio account SID is not set")
	}

	if authToken := config.TwilioGetAuthToken(); authToken == "" {
		log.Fatalf("Twilio auth token is not set")
	}

	sourcePhoneNumber = config.TwilioGetSourcePhoneNumber()
	if sourcePhoneNumber == "" {
		log.Fatalf("Twilio source phone number is not set")
	}

	client = twilio.NewRestClient()
}

func SendSMS(c context.Context, to, message string) error {
	if message == "" {
		return errors.New("message cannot be empty")
	}

	params := &twilioApi.CreateMessageParams{}
	params.SetTo(to)
	params.SetFrom(sourcePhoneNumber)
	params.SetBody(message)

	_, err := client.Api.CreateMessage(params)
	if err != nil {
		return fmt.Errorf("failed to send SMS because %w", err)
	}

	return nil
}
