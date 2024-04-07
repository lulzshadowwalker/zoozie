-- +goose Up
-- +goose StatementBegin
CREATE TABLE user_roles (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE FUNCTION update_updated_at_user_roles()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE
    ON
        user_roles
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_user_roles();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_user_roles_updated_at ON user_roles;
DROP FUNCTION update_updated_at_user_roles();
DROP TABLE user_roles;
-- +goose StatementEnd
