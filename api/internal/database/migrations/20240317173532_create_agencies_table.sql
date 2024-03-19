-- +goose Up
-- +goose StatementBegin
CREATE TABLE agencies (
  id BIGSERIAL PRIMARY KEY,
  phone_number TEXT NOT NULL UNIQUE,
  email_address TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
); 
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE agencies; 
-- +goose StatementEnd
