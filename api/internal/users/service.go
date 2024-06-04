package users

import (
	"context"
	"net/http"

	"github.com/lulzshadowwalker/zoozie/api/internal/customers"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	service struct {
		repo Repo
	}

	Repo interface {
		GetUserById(context.Context, int, interfaces.Transaction) (*entities.User, error)
		GetAgencyAgentByUserID(c context.Context, userID int, tx interfaces.Transaction) (entities.AgencyAgent, error)
		GetAgencyByID(c context.Context, id int, tx interfaces.Transaction) (*entities.Agency, error)
		GetCustomerByUserID(c context.Context, userID int, tx interfaces.Transaction) (customers.Customer, error)
	}
)

func NewService(r Repo) *service {
	return &service{
		repo: r,
	}
}

func (s *service) GetUserById(c context.Context, id int) (*entities.User, error) {
	user, err := s.repo.GetUserById(c, id, nil)
	if err != nil {
		return nil, err
	}

	if !user.Active {
		return nil, utils.NewApiError(http.StatusForbidden, "user has been deactivated")
	}

	expandedUser, err := s.expandUser(c, *user)
	if err != nil {
		return nil, err
	}
	user = &expandedUser

	return user, nil
}

func (s *service) expandUser(c context.Context, user entities.User) (entities.User, error) {
	if user.Role == entities.RoleCustomer {
		customer, err := s.repo.GetCustomerByUserID(c, int(user.ID), nil)
		if err != nil {
			return entities.User{}, err
		}

		user.Customer = &customer
	}

	if user.Role == entities.RoleAgencyAgent {
		agent, err := s.repo.GetAgencyAgentByUserID(c, int(user.ID), nil)
		if err != nil {
			return entities.User{}, err
		}

		user.Agent = &agent

		agency, err := s.repo.GetAgencyByID(c, agent.AgencyID, nil)
		if err != nil {
			return entities.User{}, err
		}

		user.Agent.Agency = agency
	}

	return user, nil
}
