-- +goose Up
-- +goose StatementBegin
CREATE TABLE agencies (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL,
  phone_number TEXT NOT NULL, -- for contact purposes only
  email_address TEXT NOT NULL, -- for contact purposes only
  logo TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_agencies()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agencies_updated_at
    BEFORE UPDATE
    ON
        agencies
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_agencies();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_agencies_updated_at ON agencies;
DROP FUNCTION update_updated_at_agencies();
DROP TABLE agencies;
-- +goose StatementEnd
