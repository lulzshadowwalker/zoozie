-- +goose Up
-- +goose StatementBegin
CREATE TABLE areas_i18n (
    id BIGSERIAL PRIMARY KEY,
    language_code CHAR(2) NOT NULL,
    area_id BIGINT NOT NULL REFERENCES areas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_areas_i18n() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_areas_i18n_updated_at BEFORE
UPDATE
    ON areas_i18n FOR EACH ROW EXECUTE PROCEDURE update_updated_at_areas_i18n();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_areas_i18n_updated_at ON areas_i18n;

DROP FUNCTION update_updated_at_areas_i18n();

DROP TABLE areas_i18n;

-- +goose StatementEnd