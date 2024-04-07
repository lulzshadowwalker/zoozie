-- +goose Up
-- +goose StatementBegin
INSERT INTO listing_extra_features_i18n(
   id,
   listing_extra_features_id,
   language_code,
   title 
)
VALUES
    (-42069, -42069, 'en', 'Swimming Pool'),
    (-42070, -42070, 'en', 'Home Theater'),
    (-42071, -42071, 'en', 'Gym'),
    (-42072, -42072, 'en', 'Fire Pit'),
    (-42073, -42073, 'en', 'Jacuzzi'),

    (-42074, -42069, 'ar', 'حمام سباحة'),
    (-42075, -42070, 'ar', 'قاعة سينما منزلية'),
    (-42076, -42071, 'ar', 'صالة ألعاب رياضية'),
    (-42077, -42072, 'ar', 'بركة نار'),
    (-42078, -42073, 'ar', 'جاكوزي');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM listing_extra_features_i18n WHERE id IN (-42069, -42070, -42071, -42072, -42073, -42074, -42075, -42076, -42077, -42078);
-- +goose StatementEnd
