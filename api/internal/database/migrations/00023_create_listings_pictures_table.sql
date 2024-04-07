-- +goose Up
-- +goose StatementBegin
CREATE TABLE listing_pictures (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE ON UPDATE CASCADE,
    url TEXT NOT NULL,
    highlighted BOOLEAN DEFAULT FALSE, -- e.g. as a cover picture
    title TEXT, -- this is not meant to be translated as it would typically be the original file name

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_listing_pictures() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_listing_pictures_updated_at BEFORE
UPDATE
    ON listing_pictures FOR EACH ROW EXECUTE PROCEDURE update_updated_at_listing_pictures();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_listing_pictures_updated_at ON listing_pictures;

DROP FUNCTION update_updated_at_listing_pictures();

DROP TABLE listing_pictures;

-- +goose StatementEnd