-- +goose Up
-- +goose StatementBegin
CREATE TABLE listing_locations (
    id BIGSERIAL PRIMARY KEY,
    country_id BIGINT NOT NULL REFERENCES countries(id),
    city_id BIGINT NOT NULL REFERENCES cities(id),
    area_id BIGINT NOT NULL REFERENCES areas(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_listing_locations() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_listing_locations_updated_at BEFORE
UPDATE
    ON listing_locations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_listing_locations();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_listing_locations_updated_at ON listing_locations;

DROP FUNCTION update_updated_at_listing_locations();

DROP TABLE listing_locations;

-- +goose StatementEnd