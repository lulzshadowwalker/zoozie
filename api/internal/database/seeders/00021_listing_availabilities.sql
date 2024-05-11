-- +goose Up
-- +goose StatementBegin
INSERT INTO listing_availabilities (
    id,
    listing_id,
    availability_id
)
VALUES
    (-42069, -42069, -42069),
    (-42070, -42069, -42070);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM
    listing_availabilities
WHERE
    id IN (-42069, -42070);
-- +goose StatementEnd