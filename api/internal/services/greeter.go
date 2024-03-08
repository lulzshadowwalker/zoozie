package services

import "fmt"

type Greeter struct {}

func (g *Greeter) Greet(name string) string {
  return fmt.Sprintf("hello, %s", name); 
}
