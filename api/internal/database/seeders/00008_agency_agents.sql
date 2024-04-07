-- +goose Up
-- +goose StatementBegin
INSERT INTO
    agency_agents (id, user_id, agency_id)
VALUES
    (-42071, -42071, -42069),
    (-42072, -42072, -42069);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM
    agency_agents
WHERE
    id IN (-42071, -42072);

-- +goose StatementEnd