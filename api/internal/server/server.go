package server

import (
	"database/sql"
	"net/http"

	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/auth"

	"github.com/lulzshadowwalker/zoozie/api/internal/conversations"
	"github.com/lulzshadowwalker/zoozie/api/internal/listings"
	zoozieMiddlware "github.com/lulzshadowwalker/zoozie/api/internal/server/middleware"
	"github.com/lulzshadowwalker/zoozie/api/internal/uploads"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Server struct {
	database *sql.DB
	port     int
}

func NewServer(database *sql.DB, port int) *Server {
	return &Server{
		database: database,
		port:     port,
	}
}

// TODO: graceful termination
func (s *Server) Run() error {
	router := echo.New()
	router.Use(zoozieMiddlware.Logger())
	// TODO: setup cors allowed origins
	router.Use(middleware.CORS())
	router.Use(middleware.Recover())

	router.Validator = utils.NewZoozieValidator()

	router.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "hello, lulzie")
	})

	router.Static("/", "public")

	api := router.Group("/api/:locale", zoozieMiddlware.Locale)

	protected := api.Group("")
	protected.Use(zoozieMiddlware.Auth())

	agencies.Init(s.database).RegisterRoutes(api)
	uploads.Init(s.database).RegisterRoutes(api)
	auth.Init(s.database).RegisterRoutes(api)
	users.Init(s.database).RegisterRoutes(protected)
	listings.Init(s.database).RegisterRoutes(api)
	conversations.Init(s.database).RegisterRoutes(api)

	router.Logger.Fatal(router.Start(":42069"))
	return nil
}
