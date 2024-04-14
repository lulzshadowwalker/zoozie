-- +goose Up
-- +goose StatementBegin
ALTER TABLE users DROP COLUMN phone_number;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users ADD COLUMN phone_number TEXT; -- NOT NULL;
-- +goose StatementEnd
