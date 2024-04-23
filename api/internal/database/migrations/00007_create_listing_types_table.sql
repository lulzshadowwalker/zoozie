-- +goose Up
-- +goose StatementBegin
-- NOTE: Do not forget to update the request DTO when adding/removing types
CREATE TABLE listing_types (
    id BIGSERIAL PRIMARY KEY,
    parent_type_id BIGINT REFERENCES listing_types(id) ON DELETE CASCADE ON UPDATE CASCADE,
    code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_listing_types() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_listing_types_updated_at BEFORE
UPDATE
    ON listing_types FOR EACH ROW EXECUTE PROCEDURE update_updated_at_listing_types();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_listing_types_updated_at ON listing_types;

DROP FUNCTION update_updated_at_listing_types();

DROP TABLE listing_types;

-- +goose StatementEnd
