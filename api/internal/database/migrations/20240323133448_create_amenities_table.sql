-- +goose Up
-- +goose StatementBegin
CREATE TABLE amenities (
  id BIGSERIAL PRIMARY KEY,
  icon TEXT NOT NULL,
  is_required BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_amenities()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_amenities_updated_at
    BEFORE UPDATE
    ON
        amenities
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_amenities();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_amenities_updated_at ON amenities;
DROP FUNCTION update_updated_at_amenities();
DROP TABLE amenities;
-- +goose StatementEnd

