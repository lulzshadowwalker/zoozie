-- +goose Up
-- +goose StatementBegin
INSERT INTO customer_favorite_listings(
    id, 
    customer_id,
    listing_id
)  
VALUES
    (-42069, -42069, -42069); 
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM customer_favorite_listings WHERE id = -42069;
-- +goose StatementEnd
