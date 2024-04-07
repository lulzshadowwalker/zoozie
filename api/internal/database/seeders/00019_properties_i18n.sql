-- +goose Up
-- +goose StatementBegin
INSERT INTO
    properties_i18n (
        id,
        language_code,
        property_id,
        bedrooms_description,
        bathrooms_description,
        area_description,
        furnished_description,
        year_built_description
    )
VALUES
    (
        -42069,
        'en',
        -42069,
        'Two Master Bedrooms',
        NULL,
        NULL,
        NULL,
        'Regularly Renovated'
    ),
    (
        -42070,
        'ar',
        -42069,
        'غرفتا نوم رئيسيتان',
        NULL,
        NULL,
        NULL,
        'تُجرى التجديدات بانتظام'
    );
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM properties_i18n WHERE id IN (-42069, -42070);
-- +goose StatementEnd
