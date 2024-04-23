-- +goose Up
-- +goose StatementBegin
INSERT INTO
    properties (
        id,
        listing_id,
        bedrooms,
        bathrooms,
        area,
        furnished,
        year_built,
        property_status_id
    )
VALUES
    (-42069, -42069, 4, 3, 390, TRUE, 2003, -42069);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM
    properties
WHERE
    id = -42069;

-- +goose StatementEnd