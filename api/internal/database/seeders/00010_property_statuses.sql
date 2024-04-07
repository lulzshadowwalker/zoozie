-- +goose Up
-- +goose StatementBegin
INSERT INTO
    property_statuses (id, code)
VALUES
    (-42069, 'ACTIVE'),
    (-42070, 'SOLD'),
    (-42071, 'RENTED');

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM
    property_statuses
WHERE
    id IN (-42069, -42070, -42071);
-- +goose StatementEnd