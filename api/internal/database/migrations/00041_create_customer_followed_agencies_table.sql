
-- +goose Up
-- +goose StatementBegin
CREATE TABLE customer_followed_agencies (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  agency_id BIGINT NOT NULL REFERENCES agencies(id) ON DELETE CASCADE ON UPDATE CASCADE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl,
  UNIQUE(customer_id, agency_id)
);

CREATE FUNCTION update_updated_at_customer_followed_agencies()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_followed_agencies_updated_at
    BEFORE UPDATE
    ON
        customer_followed_agencies
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_customer_followed_agencies();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_customer_followed_agencies_updated_at ON customer_followed_agencies;
DROP FUNCTION update_updated_at_customer_followed_agencies();
DROP TABLE customer_followed_agencies;
-- +goose StatementEnd
