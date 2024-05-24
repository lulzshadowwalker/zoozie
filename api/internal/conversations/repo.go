package conversations

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/go-jet/jet/v2/qrm"
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"

	. "github.com/go-jet/jet/v2/postgres"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/table"
)

var ErrConversationNotFound = errors.New("conversation not found")

type (
	repo struct {
		database *sql.DB
		customersRepo
		agenciesRepo
		usersRepo
	}

	customersRepo interface {
		GetCustomerByID(context.Context, int, interfaces.Transaction) (customers.Customer, error)
	}

	usersRepo interface {
		GetUserById(c context.Context, id int, tx interfaces.Transaction) (*entities.User, error)
	}

	agenciesRepo interface {
		GetAgencyByID(context.Context, int, interfaces.Transaction) (*entities.Agency, error)
	}
)

func NewRepo(database *sql.DB) *repo {
	customersRepoImpl := customers.NewRepo(database)
	agenciesRepoImpl := agencies.NewRepo(database)
	usersRepoImpl := users.NewRepo(database)

	return &repo{
		database:      database,
		customersRepo: customersRepoImpl,
		agenciesRepo:  agenciesRepoImpl,
		usersRepo:     usersRepoImpl,
	}
}

func (r *repo) Begin(context.Context) (interfaces.Transaction, error) {
	return r.database.Begin()
}

func (r *repo) StoreMessage(c context.Context, message Message, tx interfaces.Transaction) (Message, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbMessage DBMessage
	if err := ConversationMessages.INSERT(
		ConversationMessages.ConversationID,
		ConversationMessages.Sender,
		ConversationMessages.Type,
		ConversationMessages.TextContent,
	).VALUES(
		message.ConversationID,
		message.Sender,
		message.Type,
		message.Content,
	).RETURNING(ConversationMessages.ID).QueryContext(c, db, &dbMessage); err != nil {
		return Message{}, fmt.Errorf("failed to insert message because %w", err)
	}

	message.ID = int(dbMessage.Message.ID)
	return message, nil
}

func (r *repo) GetConversation(c context.Context, customerID, agencyID int, tx interfaces.Transaction) (Conversation, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbConversation DBConversation
	if err := SELECT(
		Conversations.AllColumns,
		ConversationMessages.AllColumns,
	).
		FROM(
			Conversations.
				LEFT_JOIN(ConversationMessages, Conversations.ID.EQ(ConversationMessages.ConversationID)),
		).
		WHERE(
			Conversations.CustomerID.EQ(Int(int64(customerID))).
				AND(Conversations.AgencyID.EQ(Int(int64(agencyID)))),
		).
		QueryContext(c, db, &dbConversation); err != nil {
		if errors.Is(err, qrm.ErrNoRows) {
			return Conversation{}, errors.Join(ErrConversationNotFound, err)
		}

		return Conversation{}, fmt.Errorf("failed to query the conversation because %w", err)
	}

	return dbConversation.ToEntity(), nil
}

func (r *repo) CreateConversation(c context.Context, customerID, agencyID int, tx interfaces.Transaction) (Conversation, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbConversation DBConversation
	if err := Conversations.INSERT(
		Conversations.CustomerID,
		Conversations.AgencyID,
	).VALUES(
		customerID,
		agencyID,
	).RETURNING(Conversations.AllColumns).
		QueryContext(c, db, &dbConversation); err != nil {
		return Conversation{}, fmt.Errorf("failed to insert conversation because %w", err)
	}

	return dbConversation.ToEntity(), nil
}

func (r *repo) GetConversationsByAgencyID(c context.Context, agencyID int, tx interfaces.Transaction) ([]Conversation, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbConversation []DBConversation
	if err := SELECT(Conversations.AllColumns).
		FROM(
			Conversations.
				LEFT_JOIN(ConversationMessages, Conversations.ID.EQ(ConversationMessages.ConversationID)),
		).
		WHERE(Conversations.AgencyID.EQ(Int(int64(agencyID)))).
		ORDER_BY(ConversationMessages.CreatedAt.DESC()).
		QueryContext(c, db, &dbConversation); err != nil && !errors.Is(err, qrm.ErrNoRows) {
		return nil, fmt.Errorf("failed to query the conversation because %w", err)
	}

	conversations := make([]Conversation, len(dbConversation))
	for i, conversation := range dbConversation {
		conversations[i] = conversation.ToEntity()
	}

	return conversations, nil
}

func (r *repo) GetConversationsByCustomerID(c context.Context, agencyID int, tx interfaces.Transaction) ([]Conversation, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbConversation []DBConversation
	if err := SELECT(Conversations.AllColumns).
		FROM(
			Conversations.
				LEFT_JOIN(ConversationMessages, Conversations.ID.EQ(ConversationMessages.ConversationID)),
		).
		WHERE(Conversations.CustomerID.EQ(Int(int64(agencyID)))).
		ORDER_BY(ConversationMessages.CreatedAt.DESC()).
		QueryContext(c, db, &dbConversation); err != nil && !errors.Is(err, qrm.ErrNoRows) {
		return nil, fmt.Errorf("failed to query the conversation because %w", err)
	}

	conversations := make([]Conversation, len(dbConversation))
	for i, conversation := range dbConversation {
		conversations[i] = conversation.ToEntity()
	}

	return conversations, nil
}

func (r *repo) GetConversationByID(c context.Context, id int, tx interfaces.Transaction) (Conversation, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbConversation DBConversation
	if err := SELECT(
		Conversations.AllColumns,
		ConversationMessages.ID,
		ConversationMessages.Type,
		ConversationMessages.Sender,
		ConversationMessages.TextContent,
		ConversationMessages.CreatedAt,
	).
		FROM(
			Conversations.
				LEFT_JOIN(ConversationMessages, Conversations.ID.EQ(ConversationMessages.ConversationID)),
		).
		WHERE(Conversations.ID.EQ(Int(int64(id)))).
		ORDER_BY(ConversationMessages.CreatedAt.ASC()).
		QueryContext(c, db, &dbConversation); err != nil && !errors.Is(err, qrm.ErrNoRows) {
		return Conversation{}, fmt.Errorf("failed to query the conversation because %w", err)
	}

	return dbConversation.ToEntity(), nil
}

func (r *repo) GetLastMessage(c context.Context, conversationID int, tx interfaces.Transaction) (Message, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbMessage PreviewMessage
	if err := SELECT(
		ConversationMessages.ID.AS("PreviewMessage.ID"),
		ConversationMessages.ConversationID.AS("PreviewMessage.ConversationID"),
		ConversationMessages.Sender.AS("PreviewMessage.Sender"),
		ConversationMessages.Type.AS("PreviewMessage.Type"),
		ConversationMessages.TextContent.AS("PreviewMessage.TextContent"),
		ConversationMessages.CreatedAt.AS("PreviewMessage.CreatedAt"),
		ConversationMessages.UpdatedAt.AS("PreviewMessage.UpdatedAt"),
	).
		FROM(ConversationMessages).
		WHERE(ConversationMessages.ConversationID.EQ(Int(int64(conversationID)))).
		ORDER_BY(ConversationMessages.CreatedAt.DESC()).
		LIMIT(1).
		QueryContext(c, db, &dbMessage); err != nil && !errors.Is(err, qrm.ErrNoRows) {
		return Message{}, fmt.Errorf("failed to query the message because %w", err)
	}

	return dbMessage.ToEntity(), nil
}
