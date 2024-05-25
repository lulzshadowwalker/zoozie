package listings

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"
	"net/http"

	. "github.com/go-jet/jet/v2/postgres"
	"github.com/go-jet/jet/v2/qrm"
	"github.com/lulzshadowwalker/zoozie/api/internal/agencies"
	. "github.com/lulzshadowwalker/zoozie/api/internal/database/.gen/zoozie/public/table"
	"github.com/lulzshadowwalker/zoozie/api/internal/entities"
	"github.com/lulzshadowwalker/zoozie/api/internal/interfaces"
	"github.com/lulzshadowwalker/zoozie/api/internal/utils"
)

type (
	repo struct {
		database *sql.DB
		agenciesRepo
	}

	agenciesRepo interface {
		GetAgencyByID(context.Context, int, interfaces.Transaction) (*entities.Agency, error)
	}
)

func NewRepo(database *sql.DB) *repo {
	agenciesRepoImpl := agencies.NewRepo(database)
	return &repo{
		database:     database,
		agenciesRepo: agenciesRepoImpl,
	}
}

func (r *repo) Begin(context.Context) (interfaces.Transaction, error) {
	return r.database.Begin()
}

func (r *repo) CreateListingLocation(c context.Context, location Location, tx interfaces.Transaction) (Location, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbLocation DBLocation
	stmt := ListingLocations.INSERT(
		ListingLocations.CountryID,
		ListingLocations.CityID,
		ListingLocations.AreaID,
	).VALUES(
		location.Country.ID,
		location.City.ID,
		location.Area.ID,
	).RETURNING(ListingLocations.ID)

	if err := stmt.QueryContext(c, db, &dbLocation); err != nil {
		slog.ErrorContext(c, "failed to insert listing location", "err", err)
		return Location{}, utils.NewApiError(http.StatusBadRequest, "")
	}

	language := "en"
	if err := SELECT(
		ListingLocations.AllColumns,
		Countries.AllColumns,
		CountriesI18n.AllColumns,
		Cities.AllColumns,
		CitiesI18n.AllColumns,
		Areas.AllColumns,
		AreasI18n.AllColumns,
	).FROM(
		ListingLocations.
			LEFT_JOIN(Countries, ListingLocations.CountryID.EQ(Countries.ID)).
			LEFT_JOIN(CountriesI18n, CountriesI18n.CountryID.EQ(Countries.ID).AND(CountriesI18n.LanguageCode.EQ(String(language)))).
			LEFT_JOIN(Cities, ListingLocations.CountryID.EQ(Cities.ID)).
			LEFT_JOIN(CitiesI18n, CitiesI18n.CityID.EQ(Cities.ID).AND(CitiesI18n.LanguageCode.EQ(String(language)))).
			LEFT_JOIN(Areas, ListingLocations.CountryID.EQ(Areas.ID)).
			LEFT_JOIN(AreasI18n, AreasI18n.AreaID.EQ(Areas.ID).AND(AreasI18n.LanguageCode.EQ(String(language)))),
	).WHERE(ListingLocations.ID.EQ(Int(dbLocation.Location.ID))).
		QueryContext(c, db, &dbLocation); err != nil {
		return Location{}, fmt.Errorf("failed to get listing location because %w", err)
	}

	return dbLocation.ToEntity(), nil
}

func (r *repo) CreateListingAvailability(c context.Context, listingAvailability Availability, tx interfaces.Transaction) (Availability, error) {
	var db interfaces.Transaction
	if tx != nil {
		db = tx
	} else {
		db, err := r.database.Begin()
		if err != nil {
			return Availability{}, fmt.Errorf("failed to begin transaction because %w", err)
		}

		defer db.Rollback()
	}

	var dbAvailability DBAvailability
	stmt := ListingAvailabilities.INSERT(
		ListingAvailabilities.AvailabilityID,
		ListingAvailabilities.ListingID,
	).
		VALUES(
			Availabilities.SELECT(Availabilities.ID).WHERE(Availabilities.Code.EQ(String(listingAvailability.Availability))),
			listingAvailability.ListingID,
		).
		RETURNING(ListingAvailabilities.ID)

	if err := stmt.QueryContext(c, db, &dbAvailability); err != nil {
		if utils.IsForeignKeyPostgresViolationErr(err) {
			return Availability{}, utils.NewApiError(http.StatusBadRequest, fmt.Sprintf("availability with code %s does not exist", listingAvailability.Availability))
		}

		return Availability{}, fmt.Errorf("failed to insert listing availability because %w", err)
	}
	listingAvailability.ID = int(dbAvailability.ListingAvailability.ID)

	stmt = ListingAvailabilityPrices.INSERT(
		ListingAvailabilityPrices.ListingAvailabilityID,
		ListingAvailabilityPrices.Amount,
		ListingAvailabilityPrices.Currency,
	).VALUES(
		listingAvailability.ID,
		listingAvailability.Price.Amount,
		listingAvailability.Price.Currency,
	)

	if _, err := stmt.ExecContext(c, db); err != nil {
		return Availability{}, fmt.Errorf("failed to insert listing availability price because %w", err)
	}

	if tx == nil {
		db.Commit()
	}

	return listingAvailability, nil
}

func (r *repo) CreateListingExtraFeature(c context.Context, feature ExtraFeature, tx interfaces.Transaction) (ExtraFeature, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	stmt := ListingExtraFeatures.INSERT(
		ListingExtraFeatures.ListingID,
		ListingExtraFeatures.Available,
	).VALUES(
		feature.ListingID,
		feature.Available,
	).RETURNING(ListingExtraFeatures.ID)

	var dbFeature DBExtraFeature
	if err := stmt.QueryContext(c, db, &dbFeature); err != nil {
		return ExtraFeature{}, fmt.Errorf("failed to insert listing extra feature because %w", err)
	}
	feature.ID = int(dbFeature.ExtraFeature.ID)

	return feature, nil
}

func (r *repo) CreateListingExtraFeatureI18n(c context.Context, translations ExtraFeatureI18n, tx interfaces.Transaction) (ExtraFeatureI18n, error) {
	var db qrm.Executable = r.database
	if tx != nil {
		db = tx
	}

	stmt := ListingExtraFeaturesI18n.INSERT(
		ListingExtraFeaturesI18n.LanguageCode,
		ListingExtraFeaturesI18n.ListingExtraFeaturesID,
		ListingExtraFeaturesI18n.Title,
	).VALUES(
		translations.LanguageCode,
		translations.ExtraFeatureID,
		translations.Title,
	)

	if _, err := stmt.ExecContext(c, db); err != nil {
		return ExtraFeatureI18n{}, fmt.Errorf("failed to insert listing extra feature i18n because %w", err)
	}

	return translations, nil
}

func (r *repo) CreateListingPictures(c context.Context, pictures []Picture, tx interfaces.Transaction) ([]Picture, error) {
	if len(pictures) == 0 {
		return make([]Picture, 0), nil
	}

	stmt := ListingPictures.INSERT(
		ListingPictures.ListingID,
		ListingPictures.URL,
		ListingPictures.Highlighted,
		ListingPictures.Title,
	)

	for _, picture := range pictures {
		stmt = stmt.VALUES(
			picture.ListingID,
			picture.URL,
			picture.Highlighted,
			picture.Title,
		)
	}

	var db qrm.Executable = r.database
	if tx != nil {
		db = tx
	}

	if _, err := stmt.ExecContext(c, db); err != nil {
		return nil, fmt.Errorf("failed to insert listing pictures because %w", err)
	}

	return pictures, nil
}

func (r *repo) CreateListing(c context.Context, listing Listing, tx interfaces.Transaction) (Listing, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbListingType DBType
	typeStmt := SELECT(ListingTypes.ID).
		FROM(ListingTypes).
		WHERE(ListingTypes.Code.EQ(String(listing.Type)))

	if err := typeStmt.QueryContext(c, db, &dbListingType); err != nil {
		slog.ErrorContext(c, "failed to query listing type", "err", err)
		return Listing{}, utils.NewApiError(http.StatusBadRequest, "")
	}

	var dbListing DBListing
	stmt := Listings.INSERT(
		Listings.AgencyID,
		Listings.LocationID,
		Listings.TypeID,
		Listings.Slug,
	).VALUES(
		listing.AgencyID,
		listing.Location.ID,
		dbListingType.Type.ID,
		listing.Slug,
	).RETURNING(Listings.ID)

	if err := stmt.QueryContext(c, db, &dbListing); err != nil {
		return Listing{}, fmt.Errorf("failed to insert listing because %w", err)
	}

	listing.ID = int(dbListing.Listing.ID)
	return listing, nil
}

func (r *repo) CreateListingI18n(c context.Context, translations ListingI18n, tx interfaces.Transaction) (ListingI18n, error) {
	var db qrm.Executable = r.database
	if tx != nil {
		db = tx
	}

	stmt := ListingsI18n.INSERT(
		ListingsI18n.LanguageCode,
		ListingsI18n.ListingID,
		ListingsI18n.Description,
	).
		VALUES(
			translations.LanguageCode,
			translations.ListingID,
			translations.Description,
		)

	if _, err := stmt.ExecContext(c, db); err != nil {
		return ListingI18n{}, fmt.Errorf("failed to insert listing because %w", err)
	}

	return translations, nil
}

func (r *repo) CreateProperty(c context.Context, property Property, tx interfaces.Transaction) (Property, error) {
	stmt := Properties.INSERT(
		Properties.ListingID,
		Properties.Bedrooms,
		Properties.Bathrooms,
		Properties.Area,
		Properties.Furnished,
		Properties.YearBuilt,
		Properties.PropertyStatusID,
	).VALUES(
		property.ListingID,
		property.Bedrooms.Value,
		property.Bathrooms.Value,
		property.Area.Value,
		property.Furnished.Value,
		property.YearBuilt.Value,
		PropertyStatuses.SELECT(PropertyStatuses.ID).WHERE(PropertyStatuses.Code.EQ(String("ACTIVE"))),
	).RETURNING(Properties.ID)

	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	var dbProperty DBProperty
	if err := stmt.QueryContext(c, db, &dbProperty); err != nil {
		return Property{}, fmt.Errorf("failed to insert property because %w", err)
	}
	property.ID = int(dbProperty.Property.ID)

	return property, nil
}

func (r *repo) CreatePropertyI18n(c context.Context, translations PropertyI18n, tx interfaces.Transaction) (PropertyI18n, error) {
	stmt := PropertiesI18n.INSERT(
		PropertiesI18n.PropertyID,
		PropertiesI18n.LanguageCode,
		PropertiesI18n.BedroomsDescription,
		PropertiesI18n.BathroomsDescription,
		PropertiesI18n.AreaDescription,
		PropertiesI18n.FurnishedDescription,
		PropertiesI18n.YearBuiltDescription,
	).VALUES(
		translations.PropertyID,
		translations.LanguageCode,
		translations.BedroomsDescription,
		translations.BathroomsDescription,
		translations.AreaDescription,
		translations.FurnishedDescription,
		translations.YearBuiltDescription,
	).RETURNING(PropertiesI18n.ID)

	var db qrm.Executable = r.database
	if tx != nil {
		db = tx
	}

	if _, err := stmt.ExecContext(c, db); err != nil {
		return PropertyI18n{}, fmt.Errorf("failed to insert property i18n because %w", err)
	}

	return translations, nil
}

func getBaseQueryStatement(language string, customerId *int) SelectStatement {
	fromClause := Listings.
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
		LEFT_JOIN(PropertiesI18n, Properties.ID.EQ(PropertiesI18n.PropertyID).AND(PropertiesI18n.LanguageCode.EQ(String(language)))).
		LEFT_JOIN(Agencies, Listings.AgencyID.EQ(Agencies.ID))

	cid := 0
	if customerId != nil {
		cid = *customerId
	}
	fromClause = fromClause.LEFT_JOIN(CustomerFavoriteListings, CustomerFavoriteListings.ListingID.EQ(Listings.ID).AND(CustomerFavoriteListings.CustomerID.EQ(Int(int64(cid)))))

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
		CASE().WHEN(CustomerFavoriteListings.CustomerID.EQ(Int(int64(cid)))).THEN(Bool(true)).ELSE(Bool(false)).AS("dblisting.favorite"),
	).FROM(fromClause)
}

func (r *repo) GetListingByID(c context.Context, id int) (Listing, error) {
	var customerID *int = nil
	if cid, err := utils.GetCustomerID(c); err == nil {
		customerID = &cid
	}

	language, err := utils.GetLocale(c)
	if err != nil {
		return Listing{}, err
	}

	stmt := getBaseQueryStatement(language, customerID).WHERE(Listings.ID.EQ(Int(int64(id))))

	var dest DBListing
	err = stmt.QueryContext(c, r.database, &dest)
	if err != nil {
		return Listing{}, fmt.Errorf("failed to query the listing by id because %w", err)
	}

	listing := dest.ToEntity()
	return listing, nil
}

func (r *repo) GetListingBySlug(c context.Context, slug string) (Listing, error) {
	var customerID *int = nil
	if cid, err := utils.GetCustomerID(c); err == nil {
		customerID = &cid
	}

	language, err := utils.GetLocale(c)
	if err != nil {
		return Listing{}, err
	}

	stmt := getBaseQueryStatement(language, customerID).WHERE(Listings.Slug.EQ(String(slug)))

	var dest DBListing
	err = stmt.QueryContext(c, r.database, &dest)
	if err != nil {
		return Listing{}, fmt.Errorf("failed to query the listing by slug because %w", err)
	}

	listing := dest.ToEntity()
	return listing, nil
}

func (r *repo) GetAllListings(c context.Context, filters filters) ([]Listing, error) {
	var customerID *int = nil
	if cid, err := utils.GetCustomerID(c); err == nil {
		customerID = &cid
	}

	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, err
	}

	stmt := getBaseQueryStatement(language, customerID)

	var conditions []BoolExpression

	if filters.AgencySlug != "" {
		conditions = append(conditions, Agencies.Slug.EQ(String(filters.AgencySlug)))
	}

	if filters.Furnished != nil {
		conditions = append(conditions, Properties.Furnished.EQ(Bool(*filters.Furnished)))
	}

	if filters.MinArea > 0 {
		conditions = append(conditions, Properties.Area.GT_EQ(Float(float64(filters.MinArea))))
	}

	if filters.MinYearBuilt > 0 {
		conditions = append(conditions, Properties.YearBuilt.GT_EQ(Int(int64(filters.MinYearBuilt))))
	}

	if filters.MinBedrooms > 0 {
		conditions = append(conditions, Properties.Bedrooms.GT_EQ(Int(int64(filters.MinBedrooms))))
	}

	if filters.MinBathrooms > 0 {
		conditions = append(conditions, Properties.Bathrooms.GT_EQ(Int(int64(filters.MinBathrooms))))
	}

	if filters.Type != "" {
		conditions = append(conditions, ListingTypes.Code.EQ(String(filters.Type)))
	}

	if len(filters.Locations) > 0 {
		var expressions []Expression
		for _, location := range filters.Locations {
			expressions = append(expressions, Int(int64(location)))
		}
		conditions = append(conditions, ListingLocations.ID.IN(expressions...))
	}

	if filters.Availabilities != nil && len(filters.Availabilities) > 0 {
		var expression BoolExpression
		for index, availability := range filters.Availabilities {
			var expr BoolExpression
			if availability == string(ListingAvailabilityRent) {
				expr = Availabilities.Code.EQ(String(availability))
				if filters.MinRentPrice > 0 {
					expr = expr.AND(ListingAvailabilityPrices.Amount.GT_EQ(Float(float64(filters.MinRentPrice))))
				}

				if filters.MaxRentPrice > 0 {
					expr = expr.AND(ListingAvailabilityPrices.Amount.LT_EQ(Float(float64(filters.MaxRentPrice))))
				}
			} else if availability == string(ListingAvailabilitySale) {
				expr = Availabilities.Code.EQ(String(availability))

				if filters.MinSalePrice > 0 {
					expr = expr.AND(ListingAvailabilityPrices.Amount.GT_EQ(Float(float64(filters.MinSalePrice))))
				}

				if filters.MaxSalePrice > 0 {
					expr = expr.AND(ListingAvailabilityPrices.Amount.LT_EQ(Float(float64(filters.MaxSalePrice))))
				}
			}

			if index != 0 {
				expression = expression.OR(expr)
			} else {
				expression = expr
			}
		}

		conditions = append(conditions, expression)
	}

	if len(conditions) > 0 {
		whereClause := conditions[0]
		for i := 1; i < len(conditions); i++ {
			whereClause = whereClause.AND(conditions[i])
		}
		stmt = stmt.WHERE(whereClause)
	}

	var dest []DBListing
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

func (r *repo) GetListingTypes(c context.Context, tx interfaces.Transaction) ([]ListingType, error) {
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, err
	}

	stmt := SELECT(
		ListingTypes.AllColumns,
		ListingTypesI18n.AllColumns,
	).FROM(
		ListingTypes.LEFT_JOIN(ListingTypesI18n, ListingTypes.ID.EQ(ListingTypesI18n.ListingTypeID).AND(ListingTypesI18n.LanguageCode.EQ(String(language)))),
	).WHERE(
		ListingTypes.ParentTypeID.IS_NOT_NULL(),
	)

	var dbListingType []DBType
	if err := stmt.QueryContext(c, db, &dbListingType); err != nil {
		return nil, fmt.Errorf("failed to query listing types because %w", err)
	}

	listingTypes := make([]ListingType, len(dbListingType))
	for index, dbListingType := range dbListingType {
		listingTypes[index] = dbListingType.ToEntity()
	}

	return listingTypes, nil
}

func (r *repo) GetListingLocations(c context.Context, tx interfaces.Transaction) ([]Location, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, err
	}

	stmt := SELECT(
		Countries.ID,
		Countries.Code,
		CountriesI18n.Name,
		Cities.ID,
		CitiesI18n.Name,
		Areas.ID,
		AreasI18n.Name,
	).FROM(
		Areas.LEFT_JOIN(AreasI18n, Areas.ID.EQ(AreasI18n.AreaID).AND(AreasI18n.LanguageCode.EQ(String(language)))).
			LEFT_JOIN(Cities, Areas.CityID.EQ(Cities.ID)).
			LEFT_JOIN(CitiesI18n, Cities.ID.EQ(CitiesI18n.CityID).AND(CitiesI18n.LanguageCode.EQ(String(language)))).
			LEFT_JOIN(Countries, Cities.CountryID.EQ(Countries.ID)).
			LEFT_JOIN(CountriesI18n, Countries.ID.EQ(CountriesI18n.CountryID).AND(CountriesI18n.LanguageCode.EQ(String(language)))),
	)

	var dbLocation []DBLocation
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}

	if err := stmt.QueryContext(c, db, &dbLocation); err != nil {
		return nil, fmt.Errorf("failed to query listing locations because %w", err)
	}

	locations := make([]Location, len(dbLocation))
	for index, dbLocation := range dbLocation {
		locations[index] = dbLocation.ToEntity()
	}

	return locations, nil
}

func (r *repo) GetListingsByCustomerID(c context.Context, customerID int, tx interfaces.Transaction) ([]Listing, error) {
	language, err := utils.GetLocale(c)
	if err != nil {
		return nil, err
	}

	// TODO: refactor into a view
	stmt := SELECT(
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
		CASE().WHEN(CustomerFavoriteListings.CustomerID.EQ(Int(int64(customerID)))).THEN(Bool(true)).ELSE(Bool(false)).AS("dblisting.favorite"),
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
			LEFT_JOIN(PropertiesI18n, Properties.ID.EQ(PropertiesI18n.PropertyID).AND(PropertiesI18n.LanguageCode.EQ(String(language)))).
			INNER_JOIN(CustomerFavoriteListings, Listings.ID.EQ(CustomerFavoriteListings.ListingID).AND(CustomerFavoriteListings.CustomerID.EQ(Int(int64(customerID))))),
	)

	var dbListing []DBListing
	var db qrm.Queryable = r.database
	if tx != nil {
		db = tx
	}
	if err := stmt.QueryContext(c, db, &dbListing); err != nil {
		return nil, fmt.Errorf("failed to query listings because %w", err)
	}

	listings := make([]Listing, len(dbListing))
	for index, listing := range dbListing {
		listings[index] = listing.ToEntity()
	}

	return listings, nil
}

func (r *repo) ToggleListingFavorite(c context.Context, customerID, listingID int, tx interfaces.Transaction) (bool, error) {
	var db qrm.Executable = r.database
	if tx != nil {
		db = tx
	}

	if _, err := CustomerFavoriteListings.INSERT(
		CustomerFavoriteListings.CustomerID,
		CustomerFavoriteListings.ListingID,
	).VALUES(
		Int(int64(customerID)),
		Int(int64(listingID)),
	).ExecContext(c, db); err != nil {
		if utils.IsUniqueViolationErr(err) {
			if err := r.DeleteListingFavorite(c, customerID, listingID, tx); err != nil {
				return false, err
			}

			return false, nil
		}

		if utils.IsForeignKeyPostgresViolationErr(err) {
			return false, utils.NewApiError(http.StatusNotFound, fmt.Sprintf("listing with id %d does not exist", listingID))
		}

		return false, fmt.Errorf("failed to insert listing favorite because %w", err)
	}

	return true, nil
}

func (r *repo) DeleteListingFavorite(c context.Context, customerID, listingID int, tx interfaces.Transaction) error {
	var db qrm.Executable = r.database
	if tx != nil {
		db = tx
	}

	if _, err := CustomerFavoriteListings.DELETE().WHERE(
		CustomerFavoriteListings.CustomerID.EQ(Int(int64(customerID))).AND(
			CustomerFavoriteListings.ListingID.EQ(Int(int64(listingID)))),
	).ExecContext(c, db); err != nil {
		return fmt.Errorf("failed to delete listing favorite because %w", err)
	}

	return nil
}

func (r *repo) UpdateListingSlug(c context.Context, ID int, slug string, tx interfaces.Transaction) error {
	var db qrm.Executable = r.database
	if tx != nil {
		db = tx
	}

	if _, err := Listings.UPDATE(
		Listings.Slug,
	).SET(
		String(slug),
	).WHERE(
		Listings.ID.EQ(Int(int64(ID))),
	).ExecContext(c, db); err != nil {
		return fmt.Errorf("failed to update listing slug because %w", err)
	}

	return nil
}
