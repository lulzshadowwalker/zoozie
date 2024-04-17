-- +goose Up
-- +goose StatementBegin
INSERT INTO agency_phone_numbers (
    id, 
    agency_id, 
    country_code,
    phone_number
)
VALUES 
    (
        -42069, 
        -42069,
        '962',
        '791234567'
    );
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM agency_phone_numbers WHERE id = -42069;
-- +goose StatementEnd
