-- +goose Up
-- +goose StatementBegin
INSERT INTO
    listing_availability_prices (
        id,
        listing_availability_id,
        amount,
        currency
    )
VALUES
    (-42069, -42069, 600, 'USD'),
    (-42070, -42070, 80000, 'USD');

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM
    listing_availability_prices
WHERE
    id IN (-42069, -42070);

-- +goose StatementEnd