package conversations

import (
	"time"

	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"
)

type Conversation struct {
	ID         int       `json:"id,omitempty"`
	CustomerID int       `json:"customerId,omitempty"`
	AgencyID   int       `json:"agencyId,omitempty"`
	CreatedAt  time.Time `json:"createdAt,omitempty"`

	Customer      *users.User      `json:"customer,omitempty"`
	Agency        *agencies.Agency `json:"agency,omitempty"`
	Messages      []Message        `json:"messages,omitempty"`
	LatestMessage *Message         `json:"latestMessage,omitempty"`
}

type SenderType string

const (
	SenderCustomer SenderType = "CUSTOMER"
	SenderAgency   SenderType = "AGENCY"
)

type MessageType string

const (
	MessageText MessageType = "TEXT"
	MessageAuth MessageType = "AUTH"
)

type Message struct {
	ID             int       `json:"id,omitempty"`
	ConversationID int       `json:"conversationId,omitempty"`
	SentAt         time.Time `json:"sentAt,omitempty"`

	Sender  SenderType  `json:"sender,omitempty"`
	Type    MessageType `json:"type,omitempty"`
	Content string      `json:"content,omitempty"`
}
