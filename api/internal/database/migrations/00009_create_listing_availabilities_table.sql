-- +goose Up
-- +goose StatementBegin
CREATE TABLE listing_availabilities (
    id BIGSERIAL PRIMARY KEY,
    availability_id BIGINT NOT NULL REFERENCES availabilities(id) ON UPDATE CASCADE,
    price DECIMAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_listing_availabilities() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_listing_availabilities_updated_at BEFORE
UPDATE
    ON listing_availabilities FOR EACH ROW EXECUTE PROCEDURE update_updated_at_listing_availabilities();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_listing_availabilities_updated_at ON listing_availabilities;

DROP FUNCTION update_updated_at_listing_availabilities();

DROP TABLE listing_availabilities;

-- +goose StatementEnd