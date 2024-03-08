package main

import (
  "flag"
  "fmt"
  "log"
  "net"

  pb "github.com/lulzshadowwalker/zooz/api/internal/greeter"
  "github.com/lulzshadowwalker/zooz/api/internal/handlers"
  "github.com/lulzshadowwalker/zooz/api/internal/services"
  "google.golang.org/grpc"
)

var (
  port = flag.Int("port", 50051, "The server port");
)

func main() {
  flag.Parse();

  lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port));
  if err != nil {
    log.Fatalf("failed to listen because %s", err);
  }

  // NOTE: Greeter service 
  service := services.Greeter{};
  handler := handlers.Greeter{
    GreeterService: &service,
  };

  s := grpc.NewServer();
  pb.RegisterGreeterServer(s, &handler);

  log.Printf("server listening at %v", lis.Addr());
  if err := s.Serve(lis); err != nil {
    log.Fatalf("failed to serve because %s", err);
  }
}

