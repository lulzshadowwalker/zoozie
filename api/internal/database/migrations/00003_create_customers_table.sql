-- +goose Up
-- +goose StatementBegin
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    -- TODO: setup some archive tables 
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_customers() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE
UPDATE
    ON customers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_customers();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_customers_updated_at ON customers;

DROP FUNCTION update_updated_at_customers();

DROP TABLE customers;

-- +goose StatementEnd