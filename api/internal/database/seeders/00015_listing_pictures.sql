-- +goose Up
-- +goose StatementBegin
INSERT INTO listing_pictures(
    id,
    listing_id,
    url,
    highlighted,
    title
)
VALUES 
    (-42069, -42069, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', true, 'saepe quo accusantium'),
    (-42070, -42069, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', false, 'Voluptas ipsam consectetur molestiae quasi vel.'),
    (-42071, -42069, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', false, 'Voluptas eos necessitatibus labore rerum vel.'),
    (-42072, -42069, 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', false, 'Eligendi voluptatem soluta aspernatur quod est ut harum autem voluptatibus.'),
    (-42073, -42069, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', false, NULL),
    (-42074, -42069, 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', false, 'Expedita iste quibusdam et cumque adipisci assumenda quibusdam rerum omnis.'),
    (-42075, -42069, 'https://images.unsplash.com/photo-1575421193966-2531194d4692?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', false, NULL),
    (-42076, -42069, 'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', false, 'Voluptatem doloremque doloremque aliquid corrupti et.');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM listing_pictures WHERE id >= -42069 AND id <= -42076;
-- +goose StatementEnd
