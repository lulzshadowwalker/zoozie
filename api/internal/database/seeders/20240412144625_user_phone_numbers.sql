-- +goose Up
-- +goose StatementBegin
INSERT INTO user_phone_numbers (
  id,
  user_id,
  country_code,
  phone_number 
)
VALUES
(
    -42069,
    -42069,
    '962',
    '555-555-5555'
),
(
    -42070,
    -42070,
    '962',
    '444-444-4444'
),
(
    -42071,
    -42071,
    '962',
    '111-111-1111'
),
(
    -42072,
    -42072,
    '962',
    '222-222-2222'
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM user_phone_numbers WHERE id IN (-42069, -42070, -42071, -42072);
-- +goose StatementEnd
