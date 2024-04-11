-- +goose Up
-- +goose StatementBegin
CREATE TABLE listing_availability_prices (
    id BIGSERIAL PRIMARY KEY,
    listing_availability_id BIGINT NOT NULL REFERENCES listing_availabilities(id) ON UPDATE CASCADE ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_listing_availability_prices() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_listing_availability_prices_updated_at BEFORE
UPDATE
    ON listing_availability_prices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_listing_availability_prices();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_listing_availability_prices_updated_at ON listing_availability_prices;

DROP FUNCTION update_updated_at_listing_availability_prices();

DROP TABLE listing_availability_prices;

-- +goose StatementEnd