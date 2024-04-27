"use client";

import ZoozieSelect from "@/components/shared/zoozie-select";
import { useFetchApi } from "@/lib/api";
import { useCreateListingStore } from "@/lib/store/create-listing";
import { TListingType, TLocation } from "@/lib/types";
import { useTranslations } from "next-intl";

export default function BasicInfo() {
  const t = useTranslations("dashboard.create-listing");

  return (
    <section className="mt-l-xl border-t pt-l-xl">
      <h2 className="mb-m-l text-xl font-medium">{t("basic-info")}</h2>

      <div className="space-y-m-l">
        <LocationSelection />
        <PropertyTypeSelection />
      </div>
    </section>
  );
}

function LocationSelection() {
  const t = useTranslations("dashboard.create-listing");
  const setLocation = useCreateListingStore((state) => state.setLocation);
  const location = useCreateListingStore((state) => state.location);

  const {
    data: payload,
    isLoading,
    error,
  } = useFetchApi("/listings/locations");
  if (isLoading) {
    return <></>;
  }

  if (error) {
    console.error("utils.LocationSelection: ", error);
    return <></>;
  }

  const locations = payload?.data?.locations as TLocation[] | undefined;
  if (!locations) {
    console.error("utils.LocationSelection: locations not found");
    return <></>;
  }

  return (
    <ZoozieSelect
      id="location"
      label={t("approximate-location")}
      labelClassName="font-medium"
      onChange={(e) => {
        const selectedAreaId = e.currentTarget.value;
        const location = locations.find(
          (location) => location.area?.id === Number(selectedAreaId),
        );
        if (!location) return;

        return setLocation({
          countryId: location?.country?.id,
          areaId: location?.area?.id,
          cityId: location?.city?.id,
        });
      }}
    >
      <option disabled selected={!location}>
        {t("choose-an-area")}
      </option>
      {locations?.map((loc, index) => (
        <option
          key={index}
          value={loc.area?.id}
          selected={loc?.area?.id === location?.areaId}
        >
          {loc?.area?.name ?? t("unknown-area")}
        </option>
      ))}
    </ZoozieSelect>
  );
}

function PropertyTypeSelection() {
  const t = useTranslations("dashboard.create-listing");
  const setPropertyType = useCreateListingStore(
    (state) => state.setPropertyType,
  );
  const propertyType = useCreateListingStore((state) => state.propertyType);
  const { data: payload, isLoading, error } = useFetchApi("/listings/types");
  if (isLoading) {
    return <></>;
  }

  if (error) {
    console.error("utils.PropertyTypeSelection: ", error);
    return <></>;
  }

  const propertyTypes = payload?.data?.types as TListingType[] | undefined;
  if (!propertyTypes) {
    console.error("utils.PropertyTypeSelection: listing types not found");
    return <></>;
  }

  return (
    <ZoozieSelect
      id="property-type"
      label={t("property-type")}
      labelClassName="font-medium"
      onChange={(e) => {
        const selectedTypeCode = e.currentTarget.value;
        if (!selectedTypeCode) return;
        return setPropertyType(selectedTypeCode);
      }}
    >
      <option disabled selected>
        {t("choose-a-type")}
      </option>
      {propertyTypes?.map((listingType, index) => (
        <option
          key={index}
          value={listingType.code}
          selected={listingType.code === propertyType}
        >
          {listingType.name ?? t("unknown-type")}
        </option>
      ))}
    </ZoozieSelect>
  );
}
