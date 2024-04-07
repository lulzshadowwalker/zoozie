-- +goose Up
-- +goose StatementBegin
CREATE TABLE properties_i18n (
    id BIGSERIAL PRIMARY KEY,
    language_code CHAR(2) NOT NULL,
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE ON UPDATE CASCADE,
    bedrooms_description TEXT,
    bathrooms_description TEXT,
    area_description TEXT,
    furnished_description TEXT,
    year_built_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_properties_i18n() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_properties_i18n_updated_at BEFORE
UPDATE
    ON properties_i18n FOR EACH ROW EXECUTE PROCEDURE update_updated_at_properties_i18n();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_properties_i18n_updated_at ON properties_i18n;

DROP FUNCTION update_updated_at_properties_i18n();

DROP TABLE properties_i18n;
-- +goose StatementEnd