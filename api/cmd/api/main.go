package main

import (
	"log"

	"github.com/lulzshadowwalker/zooz/api/internal/config"
	"github.com/lulzshadowwalker/zooz/api/internal/database"
	"github.com/lulzshadowwalker/zooz/api/internal/server"
)

func main() {
	db := database.Database
	defer db.Close()

	app := server.NewServer(db, config.GetPort())
	log.Fatal(app.Run())
}
