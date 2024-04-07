-- +goose Up
-- +goose StatementBegin
CREATE TABLE countries (
  id BIGSERIAL PRIMARY KEY,
  code CHAR(2) UNIQUE NOT NULL, -- country code

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_countries()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_countries_updated_at
    BEFORE UPDATE
    ON
        countries
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_countries();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_countries_updated_at ON countries;
DROP FUNCTION update_updated_at_countries();
DROP TABLE countries;
-- +goose StatementEnd
