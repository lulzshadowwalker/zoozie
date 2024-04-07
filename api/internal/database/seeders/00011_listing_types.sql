-- +goose Up
-- +goose StatementBegin
INSERT INTO
    listing_types (id, parent_type_id)
VALUES
    -- Property types
    (-42069, NULL),
    -- Root node
    (-42070, -42069),
    (-42071, -42070),
    (-42072, -42070),
    (-42073, -42070),
    (-42074, -42070),
    (-42075, -42069),
    (-42076, -42075),
    (-42077, -42075),
    (-42078, -42075),
    (-42079, -42075),
    -- Land types
    (-42080, NULL),
    -- Root node
    (-42081, -42080),
    (-42082, -42080),
    (-42083, -42080);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM
    listing_types
WHERE
    id < 0;

-- +goose StatementEnd