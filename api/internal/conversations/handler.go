package conversations

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/lulzshadowwalker/zoozie/api/internal/server/middleware"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type handler struct {
	service Service
}

type Service interface {
	StoreMessage(c context.Context, message Message) (Message, error)
	CreateOrGetConversation(c context.Context, to int) (Conversation, error)

	GetConversations(context.Context) ([]Conversation, error)
	GetConversationHistory(context.Context, conversationHistoryRequest) (Conversation, error)
}

type SocketErrorCode string

const (
	ErrCodeSendFailure             SocketErrorCode = "SEND_FAILURE"
	ErrCodeReadFailure             SocketErrorCode = "READ_FAILURE"
	ErrCodeInternal                SocketErrorCode = "INTERNAL_ERROR"
	ErrCodeUnrecognizedMessageType SocketErrorCode = "UNRECOGNIZED_MESSAGE_TYPE"
)

func NewHandler(service Service) *handler {
	return &handler{
		service: service,
	}
}

func (h *handler) RegisterRoutes(e *echo.Group) {
	// customer or agency id depending on who's the one making the request
	e.GET("/conversations/chat/:to", utils.Unwrap(h.Chat), middleware.Auth())
	e.GET("/conversations/:id", utils.Unwrap(h.GetConversationHistory), middleware.Auth())
	e.GET("/conversations", utils.Unwrap(h.GetConversations), middleware.Auth())
}

var (
	upgrader      = websocket.Upgrader{}
	conversations = make(map[int]chan SocketPayload)
)

type (
	SocketPayload struct {
		Message SocketMessage `json:"message,omitempty"`
		Error   SocketError   `json:"error,omitempty"`
	}

	SocketMessage struct {
		Sender  SenderType  `json:"sender,omitempty"`
		Type    MessageType `json:"type,omitempty"`
		Content string      `json:"content,omitempty"`
		SentAt  time.Time   `json:"sentAt,omitempty"`
	}

	SocketError struct {
		Code    SocketErrorCode `json:"code,omitempty"`
		Message string          `json:"message,omitempty"`
	}
)

func NewSocketErrorPayload(code SocketErrorCode, message string) SocketPayload {
	return SocketPayload{
		Error: SocketError{
			Code:    code,
			Message: message,
		},
	}
}

func (h *handler) Chat(c echo.Context) error {
	var request conversationRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()

	conversation, err := h.service.CreateOrGetConversation(utils.TransformEchoContext(c), request.To)
	if err != nil {
		return err
	}

	if conversations[conversation.ID] == nil {
		conversations[conversation.ID] = make(chan SocketPayload, 10)
	}
	defer delete(conversations, conversation.ID)
	// * Check if room exists and create a conversation if it doesn't
	// * read message from user, store it in the database and send it via the websocket connection to the other end

	// * if message fails to be stored in the database, return an error and do not send it via the websocket
	// * still need to handle the errors on the client side

	return h.handleConnection(c, conversation, ws, conversations[conversation.ID])
}

func (h *handler) handleConnection(c echo.Context, conversation Conversation, ws *websocket.Conn, ch chan SocketPayload) error {
	go func() {
		for msg := range ch {
			if err := ws.WriteJSON(msg); err != nil {
				c.Logger().Error("failed to write message", "err", err, "conversationID", conversation.ID)
			}
		}
	}()

	for {
		var incomingPayload SocketPayload
		err := ws.ReadJSON(&incomingPayload)
		if err != nil {
			c.Logger().Error("failed to read message", "err", err, "conversationID", conversation.ID)

			if err := ws.WriteJSON(NewSocketErrorPayload(ErrCodeReadFailure, "failed to read message")); err != nil {
				c.Logger().Error("failed to write message", "err", err, "conversationID", conversation.ID)
				continue
			}

			continue
		}

		// TODO: communicate via JSON
		// TODO: refactor out the writeJSON method

		// outgoingPayload := NewTextSocketPayload(incomingPayload.Content.Content)
		// if err := ws.WriteJSON(outgoingPayload); err != nil {
		// 	c.Logger().Error("failed to write message", "err", err, "conversationID", conversation.ID)
		// 	continue
		// }

		if incomingPayload.Message.Type != MessageText {
			if err := ws.WriteJSON(NewSocketErrorPayload(ErrCodeUnrecognizedMessageType, "unrecognized message type")); err != nil {
				c.Logger().Error("failed to write message", "err", err, "conversationID", conversation.ID)
			}
			continue
		}

		msg, err := h.service.StoreMessage(utils.TransformEchoContext(c), Message{
			// NOTE: do not pass in any of the decoded sensitive data from the incoming payload into the service
			ConversationID: conversation.ID,
			Type:           incomingPayload.Message.Type,
			Content:        incomingPayload.Message.Content,
		})
		if err != nil {
			c.Logger().Error("failed to store message", "err", err, "conversationID", conversation.ID)
			if err := ws.WriteJSON(NewSocketErrorPayload(ErrCodeInternal, "failed to store message")); err != nil {
				c.Logger().Error("failed to write message", "err", err, "conversationID", conversation.ID)
			}

			continue
		}

		content := SocketMessage{
			Sender:  msg.Sender,
			SentAt:  msg.SentAt,
			Content: string(incomingPayload.Message.Content),
			Type:    MessageText,
		}

		message := SocketPayload{Message: content}
		ch <- message
	}
}

func (h *handler) GetConversations(c echo.Context) error {
	conversations, err := h.service.GetConversations(utils.TransformEchoContext(c))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"conversations": conversations,
		},
	})
}

func (h *handler) GetConversationHistory(c echo.Context) error {
	var request conversationHistoryRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	request.Expand = c.QueryParams()["expand"]
	log.Println(len(c.QueryParams()["expand"]))

	conversation, err := h.service.GetConversationHistory(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"conversation": conversation,
		},
	})
}
