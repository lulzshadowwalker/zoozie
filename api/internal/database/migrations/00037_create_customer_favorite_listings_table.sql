-- +goose Up
-- +goose StatementBegin

-- we make a distinction between customers and agents and for now only customers
-- are allowed to add favorites. a system of *switch to customer* later on can be implemented
-- if necessary 
CREATE TABLE customer_favorite_listings (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE ON UPDATE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_customer_favorite_listings() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_customer_favorite_listings_updated_at BEFORE
UPDATE
    ON customer_favorite_listings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_customer_favorite_listings();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_customer_favorite_listings_updated_at ON customer_favorite_listings;

DROP FUNCTION update_updated_at_customer_favorite_listings();

DROP TABLE customer_favorite_listings;

-- +goose StatementEnd