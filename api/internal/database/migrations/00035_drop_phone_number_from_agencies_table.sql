-- +goose Up
-- +goose StatementBegin
ALTER TABLE agencies DROP COLUMN phone_number;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE agencies ADD COLUMN phone_number TEXT;
-- +goose StatementEnd
