-- +goose Up
-- +goose StatementBegin
-- Index for listings table
CREATE INDEX idx_listings_id ON listings (id);
CREATE INDEX idx_listings_i18n_listing_id ON listings_i18n (listing_id);
CREATE INDEX idx_listing_prices_listing_id ON listing_prices (listing_id);
CREATE INDEX idx_listing_core_features_listing_id ON listing_core_features (listing_id);
CREATE INDEX idx_listing_core_features_i18n_listing_core_feature_id ON listing_core_features_i18n (listing_core_feature_id);
CREATE INDEX idx_listing_extra_features_listing_id ON listing_extra_features (listing_id);
CREATE INDEX idx_listing_extra_features_i18n_listing_extra_features_id ON listing_extra_features_i18n (listing_extra_features_id);
CREATE INDEX idx_listing_pictures_listing_id ON listing_pictures (listing_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Drop index for listings table
DROP INDEX idx_listings_id;
DROP INDEX idx_listings_i18n_listing_id;
DROP INDEX idx_listing_prices_listing_id;
DROP INDEX idx_listing_core_features_listing_id;
DROP INDEX idx_listing_core_features_i18n_listing_core_feature_id;
DROP INDEX idx_listing_extra_features_listing_id;
DROP INDEX idx_listing_extra_features_i18n_listing_extra_features_id;
DROP INDEX idx_listing_pictures_listing_id;
-- +goose StatementEnd
