-- +goose Up
-- +goose StatementBegin
INSERT INTO countries(id, code)
VALUES
    (-42069, 'JO');

INSERT INTO countries_i18n(
    country_id,
    language_code,
    name
)
VALUES
    (-42069, 'en', 'Jordan'),
    (-42069, 'ar', 'الأردن');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM countries WHERE id < 0;
-- +goose StatementEnd
