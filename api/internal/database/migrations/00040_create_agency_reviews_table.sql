
-- +goose Up
-- +goose StatementBegin
CREATE TABLE agency_reviews (
  id BIGSERIAL PRIMARY KEY,
  agency_id BIGINT NOT NULL REFERENCES agencies(id) ON DELETE CASCADE ON UPDATE CASCADE,
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  content TEXT,
  rating INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl,
  UNIQUE(customer_id, agency_id)
);

CREATE FUNCTION update_updated_at_agency_reviews()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agency_reviews_updated_at
    BEFORE UPDATE
    ON
        agency_reviews
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_agency_reviews();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_agency_reviews_updated_at ON agency_reviews;
DROP FUNCTION update_updated_at_agency_reviews();
DROP TABLE agency_reviews;
-- +goose StatementEnd
