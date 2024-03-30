package repos

import (
	"context"
	"database/sql"
	"fmt"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/model"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zooz/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/models"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type ListingsRepo struct {
	database *sql.DB
}

func NewListingsRepo(database *sql.DB) *ListingsRepo {
	return &ListingsRepo{
		database: database,
	}
}

func (r *ListingsRepo) CreateListing(c context.Context, listing models.Listing) (models.Listing, error) {
	languageCode, err := utils.GetLocale(c)
	if err != nil {
		return models.Listing{}, err
	}

	tx, err := r.database.BeginTx(c, nil)
	if err != nil {
		return models.Listing{}, fmt.Errorf("failed to start transaction because %w", err)
	}
	defer tx.Rollback()

	// listing
	// FIXME: dynamic agency id
	l := model.Listings{}
	err = Listings.INSERT(Listings.AgencyID).VALUES(Int(1)).RETURNING(Listings.ID).QueryContext(c, tx, &l)
	if err != nil {
		return models.Listing{}, fmt.Errorf("failed to insert listing because %w", err)
	}
	listing.ID = int(l.ID)

	_, err = ListingsI18n.INSERT(ListingsI18n.ListingID, ListingsI18n.Description, ListingsI18n.LanguageCode).VALUES(listing.ID, listing.Description, languageCode).ExecContext(c, tx)
	if err != nil {
		return models.Listing{}, fmt.Errorf("failed to insert listing i18n because %w", err)
	}

	// price
	p := model.ListingPrices{}
	err = ListingPrices.INSERT(ListingPrices.ListingID, ListingPrices.Amount, ListingPrices.Currency).VALUES(listing.ID, listing.Price.Amount, listing.Price.Currency).RETURNING(ListingPrices.ID).QueryContext(c, tx, &p)
	if err != nil {
		return models.Listing{}, fmt.Errorf("failed to insert listing price because %w", err)
	}
	listing.Price.ID = int(p.ID)

	// listing core features
	for index := range listing.CoreFeatures {
		coreFeature := &listing.CoreFeatures[index]
		f := model.ListingCoreFeatures{}
		err = ListingCoreFeatures.INSERT(ListingCoreFeatures.ListingID, ListingCoreFeatures.CoreFeatureID).VALUES(listing.ID, coreFeature.CoreFeatureID).RETURNING(ListingCoreFeatures.ID).QueryContext(c, tx, &f)
		if err != nil {
			return models.Listing{}, fmt.Errorf("failed to insert listing core feature because %w", err)
		}
		coreFeature.ID = int(f.ID)

		_, err = ListingCoreFeaturesI18n.INSERT(ListingCoreFeaturesI18n.ListingCoreFeatureID, ListingCoreFeaturesI18n.Title, ListingCoreFeaturesI18n.Description, ListingCoreFeaturesI18n.LanguageCode).VALUES(coreFeature.ID, coreFeature.Title, coreFeature.Description, languageCode).ExecContext(c, tx)
		if err != nil {
			return models.Listing{}, fmt.Errorf("failed to insert listing core feature i18n because %w", err)
		}
	}

	// listing extra features
	for index := range listing.ExtraFeatures {
		extraFeature := &listing.ExtraFeatures[index]
		f := model.ListingExtraFeatures{}
		err = ListingExtraFeatures.INSERT(ListingExtraFeatures.ListingID, ListingExtraFeatures.Exists).VALUES(listing.ID, extraFeature.Exists).RETURNING(ListingExtraFeatures.ID).QueryContext(c, tx, &f)
		if err != nil {
			return models.Listing{}, fmt.Errorf("failed to insert listing extra feature because %w", err)
		}
		extraFeature.ID = int(f.ID)

		_, err = ListingExtraFeaturesI18n.INSERT(ListingExtraFeaturesI18n.ListingExtraFeaturesID, ListingCoreFeaturesI18n.Title, ListingCoreFeaturesI18n.LanguageCode).VALUES(extraFeature.ID, extraFeature.Title, languageCode).ExecContext(c, tx)
		if err != nil {
			return models.Listing{}, fmt.Errorf("failed to insert listing extra feature i18n because %w", err)
		}
	}

	// listing pictures
	for index := range listing.Pictures {
		picture := &listing.Pictures[index]
		p := model.ListingPictures{}
		err = ListingPictures.INSERT(ListingPictures.ListingID, ListingPictures.URL, ListingPictures.Title).VALUES(listing.ID, picture.Url, picture.Title).RETURNING(ListingPictures.ID).QueryContext(c, tx, &p)
		if err != nil {
			return models.Listing{}, fmt.Errorf("failed to insert listing picture because %w", err)
		}
		picture.ID = int(p.ID)
	}

	err = tx.Commit()
	if err != nil {
		return models.Listing{}, fmt.Errorf("failed to commit transaction because %w", err)
	}

	return listing, nil
}
