-- +goose Up
-- +goose StatementBegin
CREATE TYPE DataType AS ENUM ('text', 'number'); -- update the postman collection on any change

CREATE TABLE core_features (
  id BIGSERIAL PRIMARY KEY,
  icon TEXT NOT NULL,
  required BOOLEAN DEFAULT FALSE NOT NULL,
  data_type DataType NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_core_features()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_core_features_updated_at
    BEFORE UPDATE
    ON
        core_features
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_core_features();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_core_features_updated_at ON core_features;
DROP FUNCTION update_updated_at_core_features();
DROP TABLE core_features;
DROP TYPE DataType;
-- +goose StatementEnd

