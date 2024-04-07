-- +goose Up
-- +goose StatementBegin
CREATE TABLE property_statuses (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_property_statuses()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_property_statuses_updated_at
    BEFORE UPDATE
    ON
        property_statuses
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_property_statuses();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_property_statuses_updated_at ON property_statuses;
DROP FUNCTION update_updated_at_property_statuses();
DROP TABLE property_statuses;
-- +goose StatementEnd
