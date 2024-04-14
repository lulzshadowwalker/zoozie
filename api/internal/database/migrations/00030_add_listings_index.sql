-- +goose Up
-- +goose StatementBegin
CREATE INDEX idx_listings_type_id ON listings (type_id);

CREATE INDEX idx_listings_location_id ON listings (location_id);

CREATE INDEX idx_listings_i18n_listing_id ON listings_i18n (listing_id);

CREATE INDEX idx_listings_i18n_language_code ON listings_i18n (language_code);

CREATE INDEX idx_listing_extra_features_listing_id ON listing_extra_features (listing_id);

CREATE INDEX idx_listing_extra_features_i18n_listing_extra_features_id ON listing_extra_features_i18n (listing_extra_features_id);

CREATE INDEX idx_listing_extra_features_i18n_language_code ON listing_extra_features_i18n (language_code);

CREATE INDEX idx_listing_pictures_listing_id ON listing_pictures (listing_id);

CREATE INDEX idx_listing_availabilities_listing_id ON listing_availabilities (listing_id);

CREATE INDEX idx_listing_availabilities_availability_id ON listing_availabilities (availability_id);

CREATE INDEX idx_listing_availability_prices_listing_availability_id ON listing_availability_prices (listing_availability_id);

CREATE INDEX idx_listing_types_id ON listing_types (id);

CREATE INDEX idx_listing_types_i18n_listing_type_id ON listing_types_i18n (listing_type_id);

CREATE INDEX idx_listing_types_i18n_language_code ON listing_types_i18n (language_code);

CREATE INDEX idx_listing_locations_id ON listing_locations (id);

CREATE INDEX idx_listing_locations_country_id ON listing_locations (country_id);

CREATE INDEX idx_listing_locations_city_id ON listing_locations (city_id);

CREATE INDEX idx_listing_locations_area_id ON listing_locations (area_id);

CREATE INDEX idx_countries_id ON countries (id);

CREATE INDEX idx_countries_i18n_country_id ON countries_i18n (country_id);

CREATE INDEX idx_countries_i18n_language_code ON countries_i18n (language_code);

CREATE INDEX idx_cities_id ON cities (id);

CREATE INDEX idx_cities_i18n_city_id ON cities_i18n (city_id);

CREATE INDEX idx_cities_i18n_language_code ON cities_i18n (language_code);

CREATE INDEX idx_areas_id ON areas (id);

CREATE INDEX idx_areas_i18n_area_id ON areas_i18n (area_id);

CREATE INDEX idx_areas_i18n_language_code ON areas_i18n (language_code);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_listings_type_id;

DROP INDEX IF EXISTS idx_listings_location_id;

DROP INDEX IF EXISTS idx_listings_i18n_listing_id;

DROP INDEX IF EXISTS idx_listings_i18n_language_code;

DROP INDEX IF EXISTS idx_listing_extra_features_listing_id;

DROP INDEX IF EXISTS idx_listing_extra_features_i18n_listing_extra_features_id;

DROP INDEX IF EXISTS idx_listing_extra_features_i18n_language_code;

DROP INDEX IF EXISTS idx_listing_pictures_listing_id;

DROP INDEX IF EXISTS idx_listing_availabilities_listing_id;

DROP INDEX IF EXISTS idx_listing_availabilities_availability_id;

DROP INDEX IF EXISTS idx_listing_availability_prices_listing_availability_id;

DROP INDEX IF EXISTS idx_listing_types_id;

DROP INDEX IF EXISTS idx_listing_types_i18n_listing_type_id;

DROP INDEX IF EXISTS idx_listing_types_i18n_language_code;

DROP INDEX IF EXISTS idx_listing_locations_id;

DROP INDEX IF EXISTS idx_listing_locations_country_id;

DROP INDEX IF EXISTS idx_listing_locations_city_id;

DROP INDEX IF EXISTS idx_listing_locations_area_id;

DROP INDEX IF EXISTS idx_countries_id;

DROP INDEX IF EXISTS idx_countries_i18n_country_id;

DROP INDEX IF EXISTS idx_countries_i18n_language_code;

DROP INDEX IF EXISTS idx_cities_id;

DROP INDEX IF EXISTS idx_cities_i18n_city_id;

DROP INDEX IF EXISTS idx_cities_i18n_language_code;

DROP INDEX IF EXISTS idx_areas_id;

DROP INDEX IF EXISTS idx_areas_i18n_area_id;

DROP INDEX IF EXISTS idx_areas_i18n_language_code;
-- +goose StatementEnd
