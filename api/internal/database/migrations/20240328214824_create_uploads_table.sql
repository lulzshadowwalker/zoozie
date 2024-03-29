-- +goose Up
-- +goose StatementBegin
CREATE TABLE uploads (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file TEXT NOT NULL,

-- TODO: might wanna save original_file_name

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_uploads()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_uploads_updated_at
    BEFORE UPDATE
    ON
        uploads
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_uploads();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_uploads_updated_at ON uploads;
DROP FUNCTION update_updated_at_uploads();
DROP TABLE uploads;
-- +goose StatementEnd

