-- +goose Up
-- +goose StatementBegin
INSERT INTO cities(id, country_id)
VALUES
    (-42069, -42069);

INSERT INTO cities_i18n(city_id, language_code, name)
VALUES
    (-42069, 'en', 'Amman'),
    (-42069, 'ar', 'عمان');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM cities WHERE id < 0;
-- +goose StatementEnd
