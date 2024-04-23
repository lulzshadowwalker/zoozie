-- +goose Up
-- +goose StatementBegin
-- NOTE: Do not forget to update the request DTO when adding/removing types
INSERT INTO
    listing_types (id, parent_type_id, code)
VALUES
    -- Property types
    (-42069, NULL, 'PROPERTY'),
    -- Root node
    (-42070, -42069, 'COMMERCIAL_PROPERTY'),
    (-42071, -42070, 'OFFICE_SPACE'),
    (-42072, -42070, 'RETAIL_SPACE'),
    (-42073, -42070, 'INDUSTRIAL_SPACE'),
    (-42074, -42070, 'MIXED_USE_PROPERTY'),
    (-42075, -42069, 'RESIDENTIAL_PROPERTY'),
    (-42076, -42075, 'APARTMENT'),
    (-42077, -42075, 'VILLA'),
    (-42078, -42075, 'TOWNHOUSE'),
    (-42079, -42075, 'CONDOMINIUM'),
    -- Land types
    (-42080, NULL, 'LAND'),
    -- Root node
    (-42081, -42080, 'COMMERCIAL_LAND'),
    (-42082, -42080, 'AGRICULTURAL_LAND'),
    (-42083, -42080, 'RESIDENTIAL_LAND');

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM
    listing_types
WHERE
    id < 0;

-- +goose StatementEnd
