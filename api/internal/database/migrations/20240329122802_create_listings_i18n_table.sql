-- +goose Up
-- +goose StatementBegin
CREATE TABLE listings_i18n (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    language_code CHAR(2) NOT NULL,
    description TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_listings_i18n() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_listings_i18n_updated_at BEFORE
UPDATE
    ON listings_i18n FOR EACH ROW EXECUTE PROCEDURE update_updated_at_listings_i18n();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_listings_i18n_updated_at ON listings_i18n;

DROP FUNCTION update_updated_at_listings_i18n();

DROP TABLE listings_i18n;

-- +goose StatementEnd