-- +goose Up
-- +goose StatementBegin
CREATE TABLE otps (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  verified_at TIMESTAMP, 

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_otps()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_otps_updated_at
    BEFORE UPDATE
    ON
        otps
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_otps();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_otps_updated_at ON otps;
DROP FUNCTION update_updated_at_otps();
DROP TABLE otps;
-- +goose StatementEnd

