-- +goose Up
-- +goose StatementBegin
INSERT INTO user_roles(id, name)
VALUES
(-1, 'customer'),
(-2, 'agency_agent'),
(-3, 'zoozie_admin');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM user_roles WHERE id < 0;
-- +goose StatementEnd
