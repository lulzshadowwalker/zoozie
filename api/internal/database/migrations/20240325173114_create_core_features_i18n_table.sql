-- +goose Up
-- +goose StatementBegin
CREATE TABLE core_features_i18n (
  id BIGSERIAL PRIMARY KEY,
  core_feature_id BIGINT NOT NULL REFERENCES core_features(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  language_code CHAR(2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_core_features_i18n()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_core_features_i18n_updated_at
    BEFORE UPDATE
    ON
        core_features_i18n
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_core_features_i18n();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_core_features_i18n_updated_at ON core_features_i18n;
DROP FUNCTION update_updated_at_core_features_i18n();
DROP TABLE core_features_i18n;
-- +goose StatementEnd

