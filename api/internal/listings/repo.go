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

var baseQueryStmt = SELECT(
	Listings.AllColumns,
	ListingsI18n.AllColumns,
	ListingExtraFeatures.AllColumns,
	ListingExtraFeaturesI18n.AllColumns,
	ListingPictures.AllColumns,
).FROM(
	Listings.
		LEFT_JOIN(ListingsI18n, Listings.ID.EQ(ListingsI18n.ListingID)).
		LEFT_JOIN(ListingExtraFeatures, Listings.ID.EQ(ListingExtraFeatures.ListingID)).
		LEFT_JOIN(ListingExtraFeaturesI18n, ListingExtraFeatures.ID.EQ(ListingExtraFeaturesI18n.ListingExtraFeaturesID)).
		LEFT_JOIN(ListingPictures, Listings.ID.EQ(ListingPictures.ListingID)),
)

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
		err = ListingExtraFeatures.INSERT(ListingExtraFeatures.ListingID, ListingExtraFeatures.Available).VALUES(listing.ID, extraFeature.Exists).RETURNING(ListingExtraFeatures.ID).QueryContext(c, tx, &f)
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
	stmt := baseQueryStmt.WHERE(Listings.ID.EQ(Int(int64(id))))

	var dest dbListing
	err := stmt.QueryContext(c, r.database, &dest)
	if err != nil {
		return Listing{}, fmt.Errorf("failed to query the listing because %w", err)
	}

	listing := dest.ToEntity()
	return listing, nil
}

func (r *repo) GetAllListings(c context.Context) ([]Listing, error) {
	stmt := baseQueryStmt
	var dest []dbListing
	err := stmt.QueryContext(c, r.database, &dest)
	if err != nil {
		return nil, fmt.Errorf("failed to query the listing because %w", err)
	}

	listings := make([]Listing, len(dest))
	for index, listing := range dest {
		listings[index] = listing.ToEntity()
	}

	return listings, nil
}
