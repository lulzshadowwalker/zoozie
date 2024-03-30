-- +goose Up
-- +goose StatementBegin
CREATE TABLE listings (
    id BIGSERIAL PRIMARY KEY,
    agency_id BIGINT NOT NULL REFERENCES users (id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_listings() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_listings_updated_at BEFORE
UPDATE
    ON listings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_listings();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_listings_updated_at ON listings;

DROP FUNCTION update_updated_at_listings();

DROP TABLE listings;

-- +goose StatementEnd