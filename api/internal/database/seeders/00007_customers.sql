-- +goose Up
-- +goose StatementBegin
INSERT INTO
    customers (id, user_id)
VALUES
    (-42069, -42069),
    (-42070, -42070);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM
    customers
where
    id in (-42069, -42070);

-- +goose StatementEnd