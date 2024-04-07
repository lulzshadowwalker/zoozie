-- +goose Up
-- +goose StatementBegin
CREATE TABLE availabilities (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_availabilities()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_availabilities_updated_at
    BEFORE UPDATE
    ON
        availabilities
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_availabilities();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_availabilities_updated_at ON availabilities;
DROP FUNCTION update_updated_at_availabilities();
DROP TABLE availabilities;
-- +goose StatementEnd
