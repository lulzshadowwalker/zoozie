-- +goose Up
-- +goose StatementBegin
CREATE TABLE cities (
    id BIGSERIAL PRIMARY KEY,
    country_id BIGINT NOT NULL REFERENCES countries(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_cities() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_cities_updated_at BEFORE
UPDATE
    ON cities FOR EACH ROW EXECUTE PROCEDURE update_updated_at_cities();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_cities_updated_at ON cities;

DROP FUNCTION update_updated_at_cities();

DROP TABLE cities;

-- +goose StatementEnd