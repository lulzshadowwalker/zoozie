package server

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	"github.com/lulzshadowwalker/zoozie/api/internal/auth"
	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/handlers"
	"github.com/lulzshadowwalker/zoozie/api/internal/repos"
	"github.com/lulzshadowwalker/zoozie/api/internal/services"
	"github.com/lulzshadowwalker/zoozie/api/internal/uploads"
	"github.com/lulzshadowwalker/zoozie/api/internal/users"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"

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

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	router.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogStatus:   true,
		LogURI:      true,
		LogError:    true,
		HandleError: true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			if v.Error == nil {
				logger.LogAttrs(context.Background(), slog.LevelInfo, "REQUEST",
					slog.String("uri", v.URI),
					slog.Int("status", v.Status),
				)
			} else {
				logger.LogAttrs(context.Background(), slog.LevelError, "REQUEST_ERROR",
					slog.String("uri", v.URI),
					slog.Int("status", v.Status),
					slog.String("err", v.Error.Error()),
				)
			}
			return nil
		},
	}))

	// TODO: setup cors allowed origins
	router.Use(middleware.CORS())
	router.Use(middleware.Recover())

	router.Validator = handlers.NewZoozieValidator()

	router.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "hello, lulzie")
	})

	router.Static("/", "public")

	api := router.Group("/api/:locale", func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			locale := c.Param("locale")
			if !utils.EqualsAny(locale, config.GetSupportedLocales()...) {
				return echo.NewHTTPError(http.StatusNotFound, fmt.Sprintf("locale %q is not supported", locale))
			}

			return next(c)
		}
	})

	agencies.Init(s.database).RegisterRoutes(api)
	uploads.Init(s.database).RegisterRoutes(api)
	auth.Init(s.database).RegisterRoutes(api)

	coreFeaturesRepo := repos.NewCoreFeaturesRepo(s.database)
	coreFeaturesService := services.NewCoreFeaturesService(coreFeaturesRepo)
	coreFeaturesHandler := handlers.NewCoreFeaturesHandler(coreFeaturesService)
	coreFeaturesHandler.RegisterRoutes(api)

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
