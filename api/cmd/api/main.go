package main

import (
	"log"

	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/lulzshadowwalker/zoozie/api/internal/database"
	"github.com/lulzshadowwalker/zoozie/api/internal/server"
)

func main() {
	db := database.Database
	defer db.Close()

	app := server.NewServer(db, config.GetPort())
	log.Fatal(app.Run())
}
