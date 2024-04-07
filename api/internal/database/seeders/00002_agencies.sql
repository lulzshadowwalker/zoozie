-- +goose Up
-- +goose StatementBegin
INSERT INTO agencies(
    id,
    slug,
    phone_number,
    email_address,
    logo
)
VALUES
(-42069, 'lulzie-housing', '+962791234567', 'lulzie@email.com', 'https://i.pinimg.com/564x/aa/15/98/aa1598985044de15e7623834aa8bdd33.jpg');

INSERT INTO agencies_i18n(
    language_code,
    agency_id,
    name,
    description
)
VALUES
('en', -42069, 'Lulzie Housing', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'),
('ar', -42069, 'لولزي العقاري', 'لوريم إيبسوم هو نص بديل شائع في صناعة الطباعة والتنضيد. تستخدم النصوص لوريم إيبسوم بشكل أساسي في الطباعة وتنضيد النصوص. حيث يمكن أن تكون الكتل النصية في الحجم الذي تريده أو تتم إضافة بعض الحروف المتحركة. اعتمادًا على الغرض من النص.');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM agencies WHERE id < 0;
-- +goose StatementEnd
