-- +goose Up
-- +goose StatementBegin
CREATE TABLE cities_i18n (
    id BIGSERIAL PRIMARY KEY,
    language_code CHAR(2) NOT NULL,
    city_id BIGINT NOT NULL REFERENCES cities(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_cities_i18n() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_cities_i18n_updated_at BEFORE
UPDATE
    ON cities_i18n FOR EACH ROW EXECUTE PROCEDURE update_updated_at_cities_i18n();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_cities_i18n_updated_at ON cities_i18n;

DROP FUNCTION update_updated_at_cities_i18n();

DROP TABLE cities_i18n;

-- +goose StatementEnd