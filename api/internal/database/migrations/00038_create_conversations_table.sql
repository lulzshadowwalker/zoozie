-- +goose Up
-- +goose StatementBegin
CREATE TABLE conversations (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE, 
    agency_id BIGINT NOT NULL REFERENCES agencies(id) ON DELETE CASCADE ON UPDATE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULl,
    UNIQUE (customer_id, agency_id)
);

CREATE FUNCTION update_updated_at_conversations() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_conversations_updated_at BEFORE
UPDATE
    ON conversations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_conversations();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_conversations_updated_at ON conversations;

DROP FUNCTION update_updated_at_conversations();

DROP TABLE IF EXISTS conversations;
-- +goose StatementEnd