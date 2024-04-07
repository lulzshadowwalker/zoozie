-- +goose Up
-- +goose StatementBegin
CREATE TABLE listing_extra_features_i18n (
    id BIGSERIAL PRIMARY KEY,
    listing_extra_features_id BIGINT NOT NULL REFERENCES listing_extra_features(id) ON DELETE CASCADE ON UPDATE CASCADE,
    language_code CHAR(2) NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_listing_extra_features_i18n() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_listing_extra_features_i18n_updated_at BEFORE
UPDATE
    ON listing_extra_features_i18n FOR EACH ROW EXECUTE PROCEDURE update_updated_at_listing_extra_features_i18n();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_listing_extra_features_i18n_updated_at ON listing_extra_features_i18n;

DROP FUNCTION update_updated_at_listing_extra_features_i18n();

DROP TABLE listing_extra_features_i18n;

-- +goose StatementEnd