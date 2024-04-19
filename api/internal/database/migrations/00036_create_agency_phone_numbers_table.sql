-- +goose Up
-- +goose StatementBegin
CREATE TABLE agency_phone_numbers (
    id BIGSERIAL PRIMARY KEY,
    agency_id BIGINT UNIQUE NOT NULL REFERENCES agencies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    country_code TEXT NOT NULL CHECK (country_code <> ''),
    phone_number TEXT NOT NULL CHECK (phone_number <> ''),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(country_code, phone_number)
);

CREATE FUNCTION update_updated_at_agency_phone_numbers() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_agency_phone_numbers_updated_at BEFORE
UPDATE
    ON agency_phone_numbers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_agency_phone_numbers();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_agency_phone_numbers_updated_at ON agency_phone_numbers;

DROP FUNCTION update_updated_at_agency_phone_numbers();

DROP TABLE agency_phone_numbers;
-- +goose StatementEnd
