-- +goose Up
-- +goose StatementBegin
CREATE TABLE listing_extra_features (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE ON UPDATE CASCADE,
    available BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_listing_extra_features() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_listing_extra_features_updated_at BEFORE
UPDATE
    ON listing_extra_features FOR EACH ROW EXECUTE PROCEDURE update_updated_at_listing_extra_features();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_listing_extra_features_updated_at ON listing_extra_features;

DROP FUNCTION update_updated_at_listing_extra_features();

DROP TABLE listing_extra_features;

-- +goose StatementEnd