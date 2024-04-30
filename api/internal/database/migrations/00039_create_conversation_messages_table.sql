-- +goose Up
-- +goose StatementBegin
CREATE TYPE MessageType AS ENUM ('TEXT');
CREATE TYPE SenderType AS ENUM ('CUSTOMER', 'AGENCY');

CREATE TABLE IF NOT EXISTS conversation_messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE ON UPDATE CASCADE,
    type MessageType NOT NULL, 
    sender SenderType NOT NULL,
    text_content TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl
);

CREATE FUNCTION update_updated_at_conversation_messages() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_conversation_messages_updated_at BEFORE
UPDATE
    ON conversation_messages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_conversation_messages();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_conversation_messages_updated_at ON conversation_messages;

DROP FUNCTION update_updated_at_conversation_messages();

DROP TABLE IF EXISTS conversation_messages;
DROP TYPE IF EXISTS MessageType;
DROP TYPE IF EXISTS SenderType;
-- +goose StatementEnd