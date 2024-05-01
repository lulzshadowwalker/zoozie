package conversations

type conversationRequest struct {
	To int `param:"to" validate:"required,number"`
}

type conversationHistoryRequest struct {
	ConversationID int      `param:"id" validate:"required,number"`
	Expand         []string `query:"expand"`
}

type getConversationsRequest struct {
	Expand []string `query:"expand"`
}
