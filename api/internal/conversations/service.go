package conversations

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"slices"

	"github.com/go-jet/jet/v2/qrm"
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

var ErrInvalidSenderType = errors.New("invalid sender type")

type service struct {
	repo Repo
}

type Repo interface {
	Begin(context.Context) (interfaces.Transaction, error)
	StoreMessage(c context.Context, message Message, tx interfaces.Transaction) (Message, error)
	GetConversation(c context.Context, customerID, agencyID int, tx interfaces.Transaction) (Conversation, error)
	CreateConversation(c context.Context, customerID, agencyID int, tx interfaces.Transaction) (Conversation, error)
	GetConversationsByAgencyID(c context.Context, agencyID int, tx interfaces.Transaction) ([]Conversation, error)
	GetConversationsByCustomerID(c context.Context, agencyID int, tx interfaces.Transaction) ([]Conversation, error)
	GetConversationByID(c context.Context, id int, tx interfaces.Transaction) (Conversation, error)
	GetAgencyByID(context.Context, int, interfaces.Transaction) (*agencies.Agency, error)
	GetCustomerByID(context.Context, int, interfaces.Transaction) (customers.Customer, error)
	GetUserById(c context.Context, id int, tx interfaces.Transaction) (*users.User, error)
	GetLastMessage(c context.Context, conversationID int, tx interfaces.Transaction) (Message, error)
}

func NewService(repo Repo) *service {
	return &service{repo: repo}
}

func (s *service) StoreMessage(c context.Context, message Message) (Message, error) {
	_, senderType, err := s.getSenderType(c)
	if err != nil {
		return Message{}, err
	}
	message.Sender = senderType

	return s.repo.StoreMessage(c, message, nil)
}

func (s *service) CreateOrGetConversation(c context.Context, to int) (Conversation, error) {
	tx, err := s.repo.Begin(c)
	if err != nil {
		return Conversation{}, err
	}
	defer tx.Rollback()

	sender, receiver, senderType, err := s.getSenderAndReceiver(c, to)
	if err != nil {
		return Conversation{}, err
	}

	var customerID, agencyID int
	switch senderType {
	case SenderCustomer:
		customerID = sender
		agencyID = receiver
	case SenderAgency:
		agencyID = sender
		customerID = receiver
	default:
		return Conversation{}, fmt.Errorf("%w %s", ErrInvalidSenderType, senderType)
	}

	conversation, err := s.repo.GetConversation(c, customerID, agencyID, tx)
	if err == nil {
		return conversation, nil
	}

	if !errors.Is(err, ErrConversationNotFound) {
		return Conversation{}, err
	}

	conversation, err = s.repo.CreateConversation(c, customerID, agencyID, tx)
	if err != nil {
		return Conversation{}, err
	}

	if err := tx.Commit(); err != nil {
		return Conversation{}, err
	}
	return conversation, err
}

func (s *service) GetConversations(c context.Context, request getConversationsRequest) ([]Conversation, error) {
	senderID, senderType, err := s.getSenderType(c)
	if err != nil {
		return nil, err
	}

	var conversations []Conversation
	switch senderType {
	case SenderCustomer:
		conversations, err = s.repo.GetConversationsByCustomerID(c, senderID, nil)
	case SenderAgency:
		conversations, err = s.repo.GetConversationsByAgencyID(c, senderID, nil)
	default:
		return conversations, fmt.Errorf("%w %s", ErrInvalidSenderType, senderType)
	}

	if err != nil {
		return nil, err
	}

	for i, conversation := range conversations {
		if request.Expand != nil {
			conversations[i], err = s.expand(c, conversation, request.Expand)
			if err != nil {
				return nil, err
			}
		}

		latestMessage, err := s.repo.GetLastMessage(c, conversation.ID, nil)
		if err != nil {
			return nil, err
		}

		conversations[i].LatestMessage = &latestMessage
	}

	return conversations, nil
}

func (s *service) GetConversationHistory(c context.Context, request conversationHistoryRequest) (Conversation, error) {
	conversation, err := s.repo.GetConversationByID(c, request.ConversationID, nil)
	if err != nil {
		return Conversation{}, err
	}

	senderID, _, err := s.getSenderType(c)
	if err != nil {
		return Conversation{}, err
	}

	if senderID != conversation.CustomerID && senderID != conversation.AgencyID {
		return Conversation{}, utils.NewApiError(http.StatusForbidden, "sender is not part of the conversation")
	}

	if conversation, err = s.expand(c, conversation, request.Expand); err != nil {
		return Conversation{}, err
	}

	return conversation, nil
}

func (s *service) expand(c context.Context, conversation Conversation, options []string) (Conversation, error) {
	if res := slices.Index(options, "agency"); res != -1 {
		agency, err := s.repo.GetAgencyByID(c, conversation.AgencyID, nil)
		if err != nil {
			if errors.Is(err, qrm.ErrNoRows) {
				slog.ErrorContext(c, "failed to get agency", "err", err)
				return Conversation{}, utils.NewApiError(http.StatusInternalServerError, "")
			}
			return Conversation{}, err
		}

		conversation.Agency = agency
	}

	if res := slices.Index(options, "customer"); res != -1 {
		customer, err := s.repo.GetCustomerByID(c, conversation.CustomerID, nil)
		if err != nil {
			if errors.Is(err, qrm.ErrNoRows) {
				slog.ErrorContext(c, "failed to get customer", "err", err)
				return Conversation{}, utils.NewApiError(http.StatusInternalServerError, "")
			}
			return Conversation{}, err
		}

		user, err := s.repo.GetUserById(c, customer.UserID, nil)
		if err != nil {
			return Conversation{}, err
		}

		if user.ProfilePicture != nil {
			profilePicture, err := utils.GetFileURL(*user.ProfilePicture)
			if err != nil {
				slog.ErrorContext(c, "failed to get profile picture file url", "err", err)
			} else {
				user.ProfilePicture = &profilePicture
			}
		}

		user.PhoneNumber = nil
		user.EmailAddress = ""

		conversation.Customer = user
	}

	return conversation, nil
}

func (s *service) getSenderAndReceiver(c context.Context, to int) (sender, receiver int, senderType SenderType, err error) {
	customerID, err := utils.GetCustomerID(c)
	if err == nil {
		return customerID, to, SenderCustomer, nil
	}

	if !errors.Is(err, utils.ErrNotCustomer) {
		return -1, -1, "", err
	}

	agencyID, err := utils.GetAgencyID(c)
	if err == nil {
		return agencyID, to, SenderAgency, nil
	}

	if !errors.Is(err, utils.ErrNotAgent) {
		return -1, -1, "", err
	}

	return -1, -1, "", ErrInvalidSenderType
}

func (s *service) getSenderType(c context.Context) (senderID int, senderType SenderType, err error) {
	customerID, err := utils.GetCustomerID(c)
	if err == nil {
		return customerID, SenderCustomer, nil
	}

	if !errors.Is(err, utils.ErrNotCustomer) {
		return -1, "", err
	}

	agencyID, err := utils.GetAgencyID(c)
	if err == nil {
		return agencyID, SenderAgency, nil
	}

	if !errors.Is(err, utils.ErrNotAgent) {
		return -1, "", err
	}

	return -1, "", ErrInvalidSenderType
}
