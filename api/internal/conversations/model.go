package conversations

import "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"

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

type DBConversation struct {
	Conversation  model.Conversations
	Messages      []DBMessage
	LatestMessage *DBMessage
}

func (c *DBConversation) ToEntity() Conversation {
	conversation := Conversation{
		ID:         int(c.Conversation.ID),
		CustomerID: int(c.Conversation.CustomerID),
		AgencyID:   int(c.Conversation.AgencyID),
		CreatedAt:  c.Conversation.CreatedAt,
		UpdatedAt:  c.Conversation.UpdatedAt,
	}

	if c.Messages != nil {
		conversation.Messages = make([]Message, len(c.Messages))
		for i, message := range c.Messages {
			conversation.Messages[i] = message.ToEntity()
		}
	}

	if c.LatestMessage != nil {
		msg := c.LatestMessage.ToEntity()
		conversation.LatestMessage = &msg
	}

	return conversation
}
