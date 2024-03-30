-- +goose Up
-- +goose StatementBegin
CREATE TABLE listing_prices (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    amount DECIMAL NOT NULL,
    currency CHAR(3),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_listing_prices() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_listing_prices_updated_at BEFORE
UPDATE
    ON listing_prices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_listing_prices();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_listing_prices_updated_at ON listing_prices;

DROP FUNCTION update_updated_at_listing_prices();

DROP TABLE listing_prices;

-- +goose StatementEnd