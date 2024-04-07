-- +goose Up
-- +goose StatementBegin
-- listings of type Property
CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE ON UPDATE CASCADE,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    area NUMERIC(10, 2) NOT NULL,
    -- square feet
    furnished BOOLEAN NOT NULL,
    year_built DATE NOT NULL,
    property_status_id BIGINT NOT NULL REFERENCES property_statuses(id) ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_properties() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at BEFORE
UPDATE
    ON properties FOR EACH ROW EXECUTE PROCEDURE update_updated_at_properties();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_properties_updated_at ON properties;

DROP FUNCTION update_updated_at_properties();

DROP TABLE properties;

-- +goose StatementEnd