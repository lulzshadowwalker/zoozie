package main

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database"
	"github.com/pressly/goose/v3"
)

const table = "seeders_db_version"

func main() {
	db := database.Database
	defer db.Close()

	goose.SetBaseFS(database.Seeders)

	if err := goose.SetDialect("postgres"); err != nil {
		panic(err)
	}

	goose.SetTableName(table)
	if err := goose.Up(db, "seeders"); err != nil {
		panic(err)
	}
}
