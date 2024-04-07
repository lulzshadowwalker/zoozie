-- +goose Up
-- +goose StatementBegin
-- Location areas
CREATE TABLE areas (
    id BIGSERIAL PRIMARY KEY,
    city_id BIGINT NOT NULL REFERENCES cities(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_areas() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_areas_updated_at BEFORE
UPDATE
    ON areas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_areas();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_areas_updated_at ON areas;

DROP FUNCTION update_updated_at_areas();

DROP TABLE areas;

-- +goose StatementEnd