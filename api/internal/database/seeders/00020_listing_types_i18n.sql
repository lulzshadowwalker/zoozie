-- +goose Up
-- +goose StatementBegin
INSERT INTO
    listing_types_i18n (
        id,
        language_code,
        listing_type_id,
        name
    )
VALUES
    -- English translations
    (-1, 'en', -42069, 'Property'),
    (-2, 'en', -42070, 'Commercial Property'),
    (-3, 'en', -42071, 'Office Space'),
    (-4, 'en', -42072, 'Retail Space'),
    (-5, 'en', -42073, 'Industrial Space'),
    (-6, 'en', -42074, 'Mixed-Use Property'),
    (-7, 'en', -42075, 'Residential Property'),
    (-8, 'en', -42076, 'Apartment'),
    (-9, 'en', -42077, 'Villa'),
    (-10, 'en', -42078, 'Townhouse'),
    (-11, 'en', -42079, 'Condominium'),
    (-12, 'en', -42080, 'Land'),
    (-13, 'en', -42081, 'Commercial Land'),
    (-14, 'en', -42082, 'Agricultural Land'),
    (-15, 'en', -42083, 'Residential Land'),
    -- Arabic translations
    (-16, 'ar', -42069, 'عقار'),
    (-17, 'ar', -42070, 'عقار تجاري'),
    (-18, 'ar', -42071, 'مساحة مكتبية'),
    (-19, 'ar', -42072, 'مساحة تجزئة'),
    (-20, 'ar', -42073, 'مساحة صناعية'),
    (-21, 'ar', -42074, 'عقار مختلط الاستخدام'),
    (-22, 'ar', -42075, 'عقار سكني'),
    (-23, 'ar', -42076, 'شقة'),
    (-24, 'ar', -42077, 'فيلا'),
    (-25, 'ar', -42078, 'بيت متقدم'),
    (-26, 'ar', -42079, 'شقة في مشروع سكني'),
    (-27, 'ar', -42080, 'أرض'),
    (-28, 'ar', -42081, 'أرض تجارية'),
    (-29, 'ar', -42082, 'أرض زراعية'),
    (-30, 'ar', -42083, 'أرض سكنية');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM listing_types_i18n WHERE id >= -30 AND id <= -1;
-- +goose StatementEnd
