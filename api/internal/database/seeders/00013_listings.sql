-- +goose Up
-- +goose StatementBegin
INSERT INTO listings(
    id,
    type_id,
    agency_id,
    location_id,
    slug
)
VALUES
    (-42069, -42077, -42069, -42069, 'amman-abdoun-villa--42069');

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM
    listings
WHERE
    id = -42069;
-- +goose StatementEnd