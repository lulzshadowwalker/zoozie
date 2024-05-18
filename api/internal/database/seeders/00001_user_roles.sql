-- +goose Up
-- +goose StatementBegin
INSERT INTO user_roles(id, name)
VALUES
(-1, 'CUSTOMER'),
(-2, 'AGENCY_AGENT'),
(-3, 'ZOOZIE_ADMIN');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM user_roles WHERE id < 0;
-- +goose StatementEnd
