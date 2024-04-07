-- +goose Up
-- +goose StatementBegin
INSERT INTO
    availabilities(id, code)
VALUES
    (-42069, 'RENT'),
    (-42070, 'BUY');

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM
    availabilities
WHERE
    id IN (-42069, -42070);

-- +goose StatementEnd