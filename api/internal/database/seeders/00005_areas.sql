-- +goose Up
-- +goose StatementBegin
INSERT iNTO areas(id, city_id)
VALUES
    (-42069, -42069);

INSERT INTO areas_i18n(
    language_code,
    area_id,
    name
)
VALUES
    ('en', -42069, 'Abdoun'),
    ('ar', -42069, 'عبدون');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM areas WHERE id < 0;
-- +goose StatementEnd
