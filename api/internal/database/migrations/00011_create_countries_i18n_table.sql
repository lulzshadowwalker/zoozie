-- +goose Up
-- +goose StatementBegin
CREATE TABLE countries_i18n (
    id BIGSERIAL PRIMARY KEY,
    language_code CHAR(2) NOT NULL,
    country_id BIGINT NOT NULL REFERENCES countries(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_countries_i18n() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_countries_i18n_updated_at BEFORE
UPDATE
    ON countries_i18n FOR EACH ROW EXECUTE PROCEDURE update_updated_at_countries_i18n();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_countries_i18n_updated_at ON countries_i18n;

DROP FUNCTION update_updated_at_countries_i18n();

DROP TABLE countries_i18n;

-- +goose StatementEnd