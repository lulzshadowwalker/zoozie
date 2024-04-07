-- +goose Up
-- +goose StatementBegin
CREATE TABLE agency_agents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    agency_id BIGINT NOT NULL REFERENCES agencies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, agency_id)
);

CREATE FUNCTION update_updated_at_agency_agents() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_agency_agents_updated_at BEFORE
UPDATE
    ON agency_agents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_agency_agents();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_agency_agents_updated_at ON agency_agents;

DROP FUNCTION update_updated_at_agency_agents();

DROP TABLE agency_agents;

-- +goose StatementEnd