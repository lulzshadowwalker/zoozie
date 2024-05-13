-- +goose Up
-- +goose StatementBegin
INSERT INTO agency_reviews(
    id,
    agency_id,
    customer_id,
    content,
    rating
)
VALUES 
    (-42069, -42069, -42069, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 4);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM agency_reviews WHERE id = -42069; 
-- +goose StatementEnd
