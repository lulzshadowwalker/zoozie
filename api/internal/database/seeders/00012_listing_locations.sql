-- +goose Up
-- +goose StatementBegin
INSERT INTO listing_locations(
    id, 
    country_id, 
    city_id, 
    area_id
)
VALUES (-42069, -42069, -42069, -42069);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM listing_locations WHERE id = -42069;
-- +goose StatementEnd
