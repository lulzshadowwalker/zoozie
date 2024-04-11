package listings

import (
	"context"
	"database/sql"
	"fmt"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/model"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type repo struct {
	database *sql.DB
}

func NewRepo(database *sql.DB) *repo {
	return &repo{
		database: database,
	}
}

func getBaseQueryStatement(language string) SelectStatement {
	return SELECT(
		// TODO: fetch only the necessary columns
		Listings.AllColumns,
		ListingsI18n.AllColumns,
		Availabilities.AllColumns,
		ListingAvailabilities.AllColumns,
		ListingAvailabilityPrices.AllColumns,
		ListingExtraFeatures.AllColumns,
		ListingExtraFeaturesI18n.AllColumns,
		ListingPictures.AllColumns,
		ListingTypes.AllColumns,
		ListingTypesI18n.AllColumns,
		ListingLocations.AllColumns,
		Countries.AllColumns,
		CountriesI18n.AllColumns,
		Cities.AllColumns,
		CitiesI18n.AllColumns,
		Areas.AllColumns,
		AreasI18n.AllColumns,
		Properties.AllColumns,
		PropertiesI18n.AllColumns,
	).FROM(
		Listings.
			LEFT_JOIN(ListingsI18n, Listings.ID.EQ(ListingsI18n.ListingID).AND(ListingsI18n.LanguageCode.EQ(String(language)))).
			LEFT_JOIN(ListingExtraFeatures, Listings.ID.EQ(ListingExtraFeatures.ListingID)).
			LEFT_JOIN(ListingExtraFeaturesI18n, ListingExtraFeatures.ID.EQ(ListingExtraFeaturesI18n.ListingExtraFeaturesID).AND(ListingExtraFeaturesI18n.LanguageCode.EQ(String(language)))).
			LEFT_JOIN(ListingPictures, Listings.ID.EQ(ListingPictures.ListingID)).
			LEFT_JOIN(ListingAvailabilities, Listings.ID.EQ(ListingAvailabilities.ListingID)).
			LEFT_JOIN(Availabilities, ListingAvailabilities.AvailabilityID.EQ(Availabilities.ID)).
			LEFT_JOIN(ListingAvailabilityPrices, ListingAvailabilities.ID.EQ(ListingAvailabilityPrices.ListingAvailabilityID)).
			LEFT_JOIN(ListingTypes, Listings.TypeID.EQ(ListingTypes.ID)).
			LEFT_JOIN(ListingTypesI18n, ListingTypes.ID.EQ(ListingTypesI18n.ListingTypeID).AND(ListingTypesI18n.LanguageCode.EQ(String(language)))).
			LEFT_JOIN(ListingLocations, Listings.LocationID.EQ(ListingLocations.ID)).
			LEFT_JOIN(Countries, ListingLocations.CountryID.EQ(Countries.ID)).
			LEFT_JOIN(CountriesI18n, Countries.ID.EQ(CountriesI18n.CountryID).AND(CountriesI18n.LanguageCode.EQ(String(language)))).
			LEFT_JOIN(Cities, ListingLocations.CityID.EQ(Cities.ID)).
			LEFT_JOIN(CitiesI18n, Cities.ID.EQ(CitiesI18n.CityID).AND(CitiesI18n.LanguageCode.EQ(String(language)))).
			LEFT_JOIN(Areas, ListingLocations.AreaID.EQ(Areas.ID)).
			LEFT_JOIN(AreasI18n, Areas.ID.EQ(AreasI18n.AreaID).AND(AreasI18n.LanguageCode.EQ(String(language)))).
			LEFT_JOIN(Properties, Listings.ID.EQ(Properties.ListingID)).
			LEFT_JOIN(PropertiesI18n, Properties.ID.EQ(PropertiesI18n.PropertyID).AND(PropertiesI18n.LanguageCode.EQ(String(language)))),
	)
}

func (r *repo) CreateListing(c context.Context, listing Listing) (Listing, error) {
	languageCode, err := utils.GetLocale(c)
	if err != nil {
		return Listing{}, err
	}

	tx, err := r.database.BeginTx(c, nil)
	if err != nil {
		return Listing{}, fmt.Errorf("failed to start transaction because %w", err)
	}
	defer tx.Rollback()

	// listing
	// FIXME: dynamic agency id
	l := model.Listings{}
	err = Listings.INSERT(Listings.AgencyID).VALUES(Int(1)).RETURNING(Listings.ID).QueryContext(c, tx, &l)
	if err != nil {
		return Listing{}, fmt.Errorf("failed to insert listing because %w", err)
	}
	listing.ID = int(l.ID)

	_, err = ListingsI18n.INSERT(ListingsI18n.ListingID, ListingsI18n.Description, ListingsI18n.LanguageCode).VALUES(listing.ID, listing.Description, languageCode).ExecContext(c, tx)
	if err != nil {
		return Listing{}, fmt.Errorf("failed to insert listing i18n because %w", err)
	}

	// price
	// TODO: now listing prices

	// listing extra features
	for index := range listing.ExtraFeatures {
		extraFeature := &listing.ExtraFeatures[index]
		f := model.ListingExtraFeatures{}
		err = ListingExtraFeatures.INSERT(ListingExtraFeatures.ListingID, ListingExtraFeatures.Available).VALUES(listing.ID, extraFeature.Available).RETURNING(ListingExtraFeatures.ID).QueryContext(c, tx, &f)
		if err != nil {
			return Listing{}, fmt.Errorf("failed to insert listing extra feature because %w", err)
		}
		extraFeature.ID = int(f.ID)

		_, err = ListingExtraFeaturesI18n.INSERT(ListingExtraFeaturesI18n.ListingExtraFeaturesID, ListingExtraFeaturesI18n.Title, ListingExtraFeaturesI18n.LanguageCode).VALUES(extraFeature.ID, extraFeature.Title, languageCode).ExecContext(c, tx)
		if err != nil {
			return Listing{}, fmt.Errorf("failed to insert listing extra feature i18n because %w", err)
		}
	}

	// listing pictures
	for index := range listing.Pictures {
		picture := &listing.Pictures[index]
		p := model.ListingPictures{}
		err = ListingPictures.INSERT(ListingPictures.ListingID, ListingPictures.URL, ListingPictures.Title).VALUES(listing.ID, picture.Url, picture.Title).RETURNING(ListingPictures.ID).QueryContext(c, tx, &p)
		if err != nil {
			return Listing{}, fmt.Errorf("failed to insert listing picture because %w", err)
		}
		picture.ID = int(p.ID)
	}

	err = tx.Commit()
	if err != nil {
		return Listing{}, fmt.Errorf("failed to commit transaction because %w", err)
	}

	return listing, nil
}

func (r *repo) GetListing(c context.Context, id int) (Listing, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return Listing{}, err
	}

	stmt := getBaseQueryStatement(language).WHERE(Listings.ID.EQ(Int(int64(id))))

	var dest dbListing
	err = stmt.QueryContext(c, r.database, &dest)
	if err != nil {
		return Listing{}, fmt.Errorf("failed to query the listing because %w", err)
	}

	listing := dest.ToEntity()
	return listing, nil
}

func (r *repo) GetAllListings(c context.Context) ([]Listing, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, err
	}

	stmt := getBaseQueryStatement(language)
	var dest []dbListing
	err = stmt.QueryContext(c, r.database, &dest)
	if err != nil {
		return nil, fmt.Errorf("failed to query the listings because %w", err)
	}

	listings := make([]Listing, len(dest))
	for index, listing := range dest {
		listings[index] = listing.ToEntity()
	}

	return listings, nil
}
