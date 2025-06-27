package database

import (
	"database/sql"
	"fmt"
	"log/slog"

	_ "github.com/lib/pq"
	"github.com/lulzshadowwalker/zoozie/api/internal/config"
)

var Database *sql.DB

func init() {
	// Build connection string dynamically
	connectionString := fmt.Sprintf(
		"host=%s user=%s dbname=%s sslmode=%s password=%s",
		config.GetDatabaseHost(),
		config.GetDatabaseUsername(),
		config.GetDatabaseName(),
		config.GetDatabaseSSLMode(),
		config.GetDatabasePassword(),
	)

	// Add port only if it's provided
	port, err := config.GetDatabasePort()
	if err == nil && port != "" {
		connectionString = fmt.Sprintf(
			"host=%s port=%s user=%s dbname=%s sslmode=%s password=%s",
			config.GetDatabaseHost(),
			port,
			config.GetDatabaseUsername(),
			config.GetDatabaseName(),
			config.GetDatabaseSSLMode(),
			config.GetDatabasePassword(),
		)
	} else if err != nil {
		slog.Warn("failed to read database port", "error", err, "message", "using connection without port specification")
	}

	database, err := sql.Open("postgres", connectionString)
	if err != nil {
		panic(fmt.Errorf("failed to open connect to database because %w", err))
	}

	err = database.Ping()
	if err != nil {
		panic(fmt.Errorf("failed to ping the database because %w", err))
	}

	Database = database
}
