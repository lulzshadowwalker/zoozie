-- +goose Up
-- +goose StatementBegin
CREATE TABLE agencies_i18n (
    id BIGSERIAL PRIMARY KEY,
    language_code CHAR(2) NOT NULL,
    agency_id BIGINT NOT NULL REFERENCES agencies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_agencies_i18n() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_agencies_i18n_updated_at BEFORE
UPDATE
    ON agencies_i18n FOR EACH ROW EXECUTE PROCEDURE update_updated_at_agencies_i18n();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_agencies_i18n_updated_at ON agencies_i18n;

DROP FUNCTION update_updated_at_agencies_i18n();

DROP TABLE agencies_i18n;

-- +goose StatementEnd