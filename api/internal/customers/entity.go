package customers

import "github.com/lulzshadowwalker/zoozie/api/internal/users"

// TODO: might wanna refactor this into User.Customer & User.Agent{}
type Customer struct {
	users.User
}
