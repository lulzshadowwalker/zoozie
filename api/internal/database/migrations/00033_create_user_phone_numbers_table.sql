-- +goose Up
-- +goose StatementBegin
CREATE TABLE user_phone_numbers (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  country_code TEXT NOT NULL CHECK (country_code <> ''),
  phone_number TEXT NOT NULL CHECK (phone_number <> ''),

    -- FIXME: account for the case 
    -- where e.g. a user registers with his new phone number which used to belong to another user on the platform (who the fuck cares .. )

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl,
  UNIQUE (country_code, phone_number)
);

CREATE FUNCTION update_updated_at_user_phone_numbers()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_phone_numbers_updated_at
    BEFORE UPDATE
    ON
        user_phone_numbers
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_user_phone_numbers();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_user_phone_numbers_updated_at ON user_phone_numbers;
DROP FUNCTION update_updated_at_user_phone_numbers();
DROP TABLE user_phone_numbers;
-- +goose StatementEnd

