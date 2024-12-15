package main

import (
	"github.com/lulzshadowwalker/zoozie/api/internal/database"
	"github.com/pressly/goose/v3"
)

func main() {
	db := database.Database
	defer db.Close()

	goose.SetBaseFS(database.Migrations)

	if err := goose.SetDialect("postgres"); err != nil {
		panic(err)
	}

	if err := goose.Up(db, "migrations"); err != nil {
		panic(err)
	}
}
