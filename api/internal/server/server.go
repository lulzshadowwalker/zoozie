package server

import (
	"database/sql"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/auth"
	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/handlers"
	"github.com/lulzshadowwalker/zoozie/api/internal/repos"
	zoozieMiddlware "github.com/lulzshadowwalker/zoozie/api/internal/server/middleware"
	"github.com/lulzshadowwalker/zoozie/api/internal/services"
	"github.com/lulzshadowwalker/zoozie/api/internal/uploads"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"

	echojwt "github.com/labstack/echo-jwt/v4"
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

// TODO: graceful shutdown
func (s *Server) Run() error {
	router := echo.New()
	router.Use(zoozieMiddlware.Logger())
	// TODO: setup cors allowed origins
	router.Use(middleware.CORS())
	router.Use(middleware.Recover())

	router.Validator = handlers.NewZoozieValidator()

	router.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "hello, lulzie")
	})

	router.Static("/", "public")

	api := router.Group("/api/:locale", zoozieMiddlware.Locale)

	agencies.Init(s.database).RegisterRoutes(api)
	uploads.Init(s.database).RegisterRoutes(api)
	auth.Init(s.database).RegisterRoutes(api)

	jwtConfig := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(entities.JwtCustomClaims)
		},
		SigningKey: []byte(config.GetJwtSecret()),
	}

	protected := api.Group("")
	protected.Use(echojwt.WithConfig(jwtConfig))

	users.Init(s.database).RegisterRoutes(protected)

	listingsRepo := repos.NewListingsRepo(s.database)
	listingsService := services.NewListingsService(listingsRepo)
	listingsHandler := handlers.NewListingsHandler(listingsService)
	listingsHandler.RegisterRoutes(api)

	router.Logger.Fatal(router.Start(":42069"))
	return nil
}
