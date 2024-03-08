package handlers

import (
  "context"
  pb "github.com/lulzshadowwalker/zooz/api/internal/greeter"
)

type Greeter struct {
  pb.UnimplementedGreeterServer
  GreeterService
} 

func NewGreetHandler(service GreeterService) *Greeter {
  return &Greeter{
    GreeterService: service, 
  };
} 

type GreeterService interface {
  Greet(name string) string;
}

func	(g *Greeter) Greet(context context.Context, request *pb.GreetRequest) (*pb.GreetResponse, error) {
  greeting := g.GreeterService.Greet(request.GetName()); 

  return &pb.GreetResponse{
    Message: greeting, 
  }, nil;
}

