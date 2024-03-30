-- +goose Up
-- +goose StatementBegin
CREATE TABLE listing_core_features (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    core_feature_id BIGINT NOT NULL REFERENCES core_features(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl,

    UNIQUE(listing_id, core_feature_id)
);

CREATE FUNCTION update_updated_at_listing_core_features() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_listing_core_features_updated_at BEFORE
UPDATE
    ON listing_core_features FOR EACH ROW EXECUTE PROCEDURE update_updated_at_listing_core_features();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_listing_core_features_updated_at ON listing_core_features;

DROP FUNCTION update_updated_at_listing_core_features();

DROP TABLE listing_core_features;

-- +goose StatementEnd