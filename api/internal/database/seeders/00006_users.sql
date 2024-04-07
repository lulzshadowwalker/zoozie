-- +goose Up
-- +goose StatementBegin
INSERT INTO
    users (
        id,
        name,
        email_address,
        phone_number,
        active,
        profile_picture,
        role
    )
VALUES
    -- roles (customer: -1, agency_agent: -2, zoozie_admin: -3)
    -- active customer
    (
        -42069,
        'John Doe',
        '2YjZP@example.com',
        '555-555-5555',
        true,
        'https://via.assets.so/album.png?id=1&q=95&w=360&h=360&fit=fill',
        -1
    ),
    -- inactive customer
    (
        -42070,
        'Jane Doe',
        '3pCJy@example.com',
        '444-444-4444',
        false,
        'https://via.assets.so/album.png?id=2&q=95&w=360&h=360&fit=fill',
        -1
    ),
    -- active agency agent
    (
        -42071,
        'Agent Smith',
        'FegtF@example.com',
        '111-111-1111',
        true,
        'https://via.assets.so/album.png?id=4&q=95&w=360&h=360&fit=fill',
        -2
    ),
    -- inactive agency agent
    (
        -42072,
        'Agent Rock',
        'RE9gQ@example.com',
        '222-222-2222',
        false,
        'https://via.assets.so/album.png?id=5&q=95&w=360&h=360&fit=fill',
        -2
    );

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM
    users
WHERE
    id IN (-42069, -42070, -42071, -42072);

-- +goose StatementEnd