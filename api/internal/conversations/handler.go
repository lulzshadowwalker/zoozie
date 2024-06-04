package conversations

import (
	"context"
	"errors"
	"fmt"
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

	GetConversations(context.Context, getConversationsRequest) ([]Conversation, error)
	GetConversationHistory(context.Context, conversationHistoryRequest) (Conversation, error)
	CreateConversation(context.Context, createConversationRequest) (Conversation, error)
}

type SocketErrorCode string

const (
	ErrCodeSendFailure             SocketErrorCode = "SEND_FAILURE"
	ErrCodeReadFailure             SocketErrorCode = "READ_FAILURE"
	ErrCodeInternalFailure         SocketErrorCode = "INTERNAL_FAILURE"
	ErrCodeUnrecognizedMessageType SocketErrorCode = "UNRECOGNIZED_MESSAGE_TYPE"
	ErrCodeUnauthenticated         SocketErrorCode = "UNAUTHENTICATED"
	ErrCodeInvalidToken            SocketErrorCode = "INVALID_TOKEN"
)

var (
	ErrUnauthenticated         = errors.New("unauthenticated")
	ErrInvalidToken            = errors.New("invalid token")
	ErrReadFailure             = errors.New("failed to read message")
	ErrWriteFailure            = errors.New("failed to write message")
	ErrUnrecognizedMessageType = errors.New("unrecognized message type")
)

func NewHandler(service Service) *handler {
	return &handler{
		service: service,
	}
}

func (h *handler) RegisterRoutes(e *echo.Group) {
	// customer or agency id depending on who's the one making the request
	// NOTE: uses custom websocket auth middleware if you will
	e.GET("/conversations/chat/:to", utils.Unwrap(h.Chat), middleware.Auth())
	e.GET("/conversations/:to", utils.Unwrap(h.GetConversationHistory), middleware.Auth())
	e.GET("/conversations", utils.Unwrap(h.GetConversations), middleware.Auth())
	e.POST("/conversations/:to", utils.Unwrap(h.CreateConversation), middleware.Auth())
}

type ConversationID = int

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			// TODO: add origin validation for websocket
			return true
		},
		ReadBufferSize:  8 * 1024,
		WriteBufferSize: 8 * 1024,
	}
	conversations = make(map[ConversationID][]SocketSession)
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

	SocketSession struct {
		ws           *websocket.Conn
		Conversation Conversation
		ConnectedAt  time.Time
	}
)

func newSocketSession(ws *websocket.Conn, conversation Conversation) SocketSession {
	return SocketSession{
		ws:           ws,
		Conversation: conversation,
		ConnectedAt:  time.Now(),
	}
}

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
		conversations[conversation.ID] = make([]SocketSession, 0)
	}
	socketSession := newSocketSession(ws, conversation)
	conversations[conversation.ID] = append(conversations[conversation.ID], socketSession)
	defer delete(conversations, conversation.ID)

	return h.handleConnection(c, socketSession)
}

// TODO: refactor WriteJSON
func (h *handler) handleConnection(c echo.Context, session SocketSession) error {
	for {
		var incomingPayload SocketPayload
		err := session.ws.ReadJSON(&incomingPayload)
		if err != nil {
			c.Logger().Error("failed to read message", "err", err, "conversationID", session.Conversation.ID)

			if err := session.ws.WriteJSON(NewSocketErrorPayload(ErrCodeReadFailure, "failed to read message")); err != nil {
				c.Logger().Error("failed to write message", "err", err, "conversationID", session.Conversation.ID)
			}

			continue
		}

		if incomingPayload.Message.Type != MessageText {
			if err := session.ws.WriteJSON(NewSocketErrorPayload(ErrCodeUnrecognizedMessageType, "unrecognized message type")); err != nil {
				c.Logger().Error("failed to write message", "err", err, "conversationID", session.Conversation.ID)
			}

			c.Logger().Error("failed to read message", "err", fmt.Errorf("%w %q", ErrUnrecognizedMessageType, incomingPayload.Message.Type), "conversationID", session.Conversation.ID)
			continue
		}

		msg, err := h.service.StoreMessage(utils.TransformEchoContext(c), Message{
			// NOTE: do not pass in any of the decoded sensitive data from the incoming payload into the service
			ConversationID: session.Conversation.ID,
			Type:           incomingPayload.Message.Type,
			Content:        incomingPayload.Message.Content,
		})
		if err != nil {
			c.Logger().Error("failed to store message", "err", err, "conversationID", session.Conversation.ID)
			if err := session.ws.WriteJSON(NewSocketErrorPayload(ErrCodeInternalFailure, "failed to store message")); err != nil {
				c.Logger().Error("failed to write message", "err", err, "conversationID", session.Conversation.ID)
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
		for _, s := range conversations[session.Conversation.ID] {
			if err := s.ws.WriteJSON(message); err != nil {
				c.Logger().Error("failed to write message", "err", err, "conversationID", session.Conversation.ID)
			}
		}
	}
}

func (h *handler) GetConversations(c echo.Context) error {
	var request getConversationsRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	conversations, err := h.service.GetConversations(utils.TransformEchoContext(c), request)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"conversations": conversations,
		},
	})
}

// TODO: get conversation history via customer id or agency id simply to align with /chat/:to
func (h *handler) GetConversationHistory(c echo.Context) error {
	var request conversationHistoryRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}

	request.Expand = c.QueryParams()["expand"]

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

func (h *handler) CreateConversation(c echo.Context) error {
	var request createConversationRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return err
	}
	request.Expand = c.QueryParams()["expand"]

	conversation, err := h.service.CreateConversation(utils.TransformEchoContext(c), request)
	if err != nil {
		if err, ok := err.(*utils.ApiError); ok && err.Status == http.StatusConflict {
			return c.JSON(err.Status, echo.Map{
				"data": echo.Map{
					"conversation": conversation,
				},
				"message": err.Message,
			})
		}

		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": echo.Map{
			"conversation": conversation,
		},
	})
}
