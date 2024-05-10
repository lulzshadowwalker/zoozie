package conversations

import (
	"log"
	"time"

	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
)

type DBMessage struct {
	Message model.ConversationMessages
}

func (m *DBMessage) ToEntity() Message {
	message := Message{
		ID:             int(m.Message.ID),
		ConversationID: int(m.Message.ConversationID),
		Sender:         SenderType(m.Message.Sender),
		Type:           MessageType(m.Message.Type),
		SentAt:         m.Message.CreatedAt,
	}

	if m.Message.TextContent != nil {
		message.Content = *m.Message.TextContent
	}

	return message
}

type PreviewMessage struct {
	ID             int64 `sql:"primary_key"`
	ConversationID int64
	Type           string
	Sender         string
	TextContent    *string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func (m *PreviewMessage) ToEntity() Message {
	message := Message{
		ID:             int(m.ID),
		ConversationID: int(m.ConversationID),
		Sender:         SenderType(m.Sender),
		Type:           MessageType(m.Type),
		SentAt:         m.CreatedAt,
	}

	if m.TextContent != nil {
		message.Content = *m.TextContent
	}

	return message
}

type DBConversation struct {
	Conversation  model.Conversations
	Messages      []DBMessage
	LatestMessage *PreviewMessage
}

func (c *DBConversation) ToEntity() Conversation {
	conversation := Conversation{
		ID:         int(c.Conversation.ID),
		CustomerID: int(c.Conversation.CustomerID),
		AgencyID:   int(c.Conversation.AgencyID),
		CreatedAt:  c.Conversation.CreatedAt,
	}

	if c.Messages != nil {
		conversation.Messages = make([]Message, len(c.Messages))
		for i, message := range c.Messages {
			conversation.Messages[i] = message.ToEntity()
		}
	}

	if c.LatestMessage != nil {
		log.Printf("latest message %#v", c.LatestMessage)
		msg := c.LatestMessage.ToEntity()
		conversation.LatestMessage = &msg
	}

	return conversation
}
