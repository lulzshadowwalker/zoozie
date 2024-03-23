-- +goose Up
-- +goose StatementBegin
CREATE TABLE amenities_i18n (
  id BIGSERIAL PRIMARY KEY,
  amenity_id BIGINT NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  language_code CHAR(2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_amenities_i18n()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_amenities_i18n_updated_at
    BEFORE UPDATE
    ON
        amenities_i18n
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_amenities_i18n();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_amenities_i18n_updated_at ON amenities_i18n;
DROP FUNCTION update_updated_at_amenities_i18n();
DROP TABLE amenities_i18n;
-- +goose StatementEnd

