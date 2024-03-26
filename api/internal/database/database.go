package database

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
	"github.com/lulzshadowwalker/zoozie/api/internal/config"
)

var Database *sql.DB

func init() {
  port, err := config.GetDatabasePort()
  if err != nil {
    panic(fmt.Errorf("failed to read database port because %w", err))
  }

	connectionString := fmt.Sprintf(
		"host=%s port=%d user=%s dbname=%s sslmode=%s password=%s",
		config.GetDatabaseHost(),
    port,
		config.GetDatabaseUsername(),
		config.GetDatabaseName(),

		// TODO:: enable sslmode in prod using build tags
		"disable",

    config.GetDatabasePassword(),
	)

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
