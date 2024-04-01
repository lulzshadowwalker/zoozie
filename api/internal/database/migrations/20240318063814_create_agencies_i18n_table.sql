-- +goose Up
-- +goose StatementBegin
CREATE TABLE agencies_i18n (
  id BIGSERIAL PRIMARY KEY,
  agency_id BIGINT NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  language_code CHAR(2) NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE agencies_i18n;
-- +goose StatementEnd
