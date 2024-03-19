package main

import (
	"log"

	"github.com/lulzshadowwalker/zooz/api/internal/config"
	"github.com/lulzshadowwalker/zooz/api/internal/database"
	"github.com/lulzshadowwalker/zooz/api/internal/server"
)

func main() {
  app := server.NewServer(database.Database, config.GetPort()) 
  log.Fatal(app.Run())
}
