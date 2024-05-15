-- +goose Up
-- +goose StatementBegin
ALTER TABLE listings ADD COLUMN slug TEXT NOT NULL UNIQUE; 
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE listings DROP COLUMN slug;
-- +goose StatementEnd
