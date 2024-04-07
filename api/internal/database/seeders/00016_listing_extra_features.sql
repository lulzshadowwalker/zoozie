-- +goose Up
-- +goose StatementBegin
INSERT INTO listing_extra_features(
    id,
    listing_id,
    available
)
VALUES 
    (-42069, -42069, true),
    (-42070, -42069, false),
    (-42071, -42069, true),
    (-42072, -42069, true),
    (-42073, -42069, false),
    (-42074, -42069, true),
    (-42075, -42069, false);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM listing_extra_features WHERE id IN (-42069, -42070, -42071, -42072, -42073, -42074, -42075);
-- +goose StatementEnd
