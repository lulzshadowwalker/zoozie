-- +goose Up
-- +goose StatementBegin
ALTER TABLE "listing_availabilities" ADD COLUMN "listing_id" BIGINT REFERENCES "listings" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "listing_availabilities" DROP COLUMN "listing_id";
-- +goose StatementEnd
