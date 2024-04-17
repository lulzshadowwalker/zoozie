-- +goose Up
-- +goose StatementBegin
// TODO: change `usres.verified` to `users.verified_at`
ALTER TABLE users ADD COLUMN verified BOOLEAN NOT NULL DEFAULT FALSE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users DROP COLUMN verified;
-- +goose StatementEnd
