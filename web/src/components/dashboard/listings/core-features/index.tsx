"use client";

import ZoozInput from "@/components/shared/zooz-input";
import {
  faBed,
  faCalendarDays,
  faCouch,
  faToilet,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import ZoozCheckbox from "@/components/shared/zooz-checkbox";
import { useCreateListingStore } from "@/lib/store/create-listing";
import { useParams } from "next/navigation";
import { Locale } from "@/lib/i18n/config";

export default function CoreFeatures() {
  const t = useTranslations("dashboard.create-listing");
  const params = useParams();
  const locale = params.locale as Locale;
  const {
    bedrooms,
    furnished,
    bathrooms,
    yearBuilt,
    area,

    arBedroomsDescription: bedroomsDescriptionAr,
    enBedroomsDescription: bedroomsDescriptionEn,
    arFurnishedDescription: furnishedDescriptionAr,
    enFurnishedDescription: furnishedDescriptionEn,
    arBathroomsDescription: bathroomsDescriptionAr,
    enBathroomsDescription: bathroomsDescriptionEn,
    arYearBuiltDescription: yearBuiltDescriptionAr,
    enYearBuiltDescription: yearBuiltDescriptionEn,
    arAreaDescription: areaDescriptionAr,
    enAreaDescription: areaDescriptionEn,

    setBedrooms,
    setBathrooms,
    setFurnished,
    setYearBuilt,
    setArea,
    setBedroomsDescription,
    setBathroomsDescription,
    setFurnishedDescription,
    setYearBuiltDescription,
    setAreaDescription,
  } = useCreateListingStore();

  function getBedroomsDescription() {
    return locale === "en" ? bedroomsDescriptionEn : bedroomsDescriptionAr;
  }

  function getBathroomsDescription() {
    return locale === "en" ? bathroomsDescriptionEn : bathroomsDescriptionAr;
  }

  function getYearBuiltDescription() {
    return locale === "en" ? yearBuiltDescriptionEn : yearBuiltDescriptionAr;
  }

  function getAreaDescription() {
    return locale === "en" ? areaDescriptionEn : areaDescriptionAr;
  }

  function getFurnishedDescription() {
    return locale === "en" ? furnishedDescriptionEn : furnishedDescriptionAr;
  }

  return (
    <section className="mt-l-xl flex items-start border-t pt-l-xl">
      <div className="flex-grow">
        <h2 className="text-xl font-medium">{t("what-this-place-offers")}</h2>
        <ul className="mt-m-l flex flex-col gap-m-l">
          <li className="relative flex items-start gap-s-m">
            <div className="flex items-center justify-center rounded-2xl border border-gray-400 bg-gray-300/5 p-xs-s text-gray-400">
              <FontAwesomeIcon icon={faCalendarDays} size="lg" />
            </div>
            <div className="flex-grow space-y-[0.8rem] self-center">
              <ZoozInput
                id="year-built-title"
                type="number"
                max={2030}
                min={1900}
                labelClassName="sr-only"
                label={`${t("year-built")}`}
                containerClassName="border-2 border-gray-300 border-dashed"
                placeholder="2000"
                required
                value={yearBuilt}
                onChange={({ target: { value } }) => setYearBuilt(value)}
              />

              <ZoozInput
                id="year-built-description"
                label={`${t("year-built")} ${t("description")}`}
                containerClassName="border-2 border-gray-300 border-dashed"
                labelClassName="sr-only"
                placeholder={`${t("description")} (${t("optional")}) `}
                value={getYearBuiltDescription()}
                onChange={({ target: { value } }) =>
                  setYearBuiltDescription(locale, value)
                }
              />
            </div>
          </li>

          <li className="relative flex items-start gap-s-m">
            <div className="flex items-center justify-center rounded-2xl border border-gray-400 bg-gray-300/5 p-xs-s text-gray-400">
              <FontAwesomeIcon icon={faToilet} size="lg" />
            </div>
            <div className="flex-grow space-y-[0.8rem] self-center">
              <ZoozInput
                id="bathrooms-title"
                type="number"
                label={`${t("bathrooms")} ${t("title")}`}
                labelClassName="sr-only"
                containerClassName="border-2 border-gray-300 border-dashed"
                placeholder={`${t("bathrooms")} ⎯ ${t("bathrooms-title-description")}`}
                required
                value={bathrooms}
                onChange={({ target: { value } }) =>
                  setBathrooms(Number(value))
                }
              />

              <ZoozInput
                id="bathrooms-description"
                label={`${t("bathrooms")}} ${t("description")}`}
                containerClassName="border-2 border-gray-300 border-dashed"
                labelClassName="sr-only"
                placeholder={`${t("description")} (${t("optional")}) `}
                value={getBathroomsDescription()}
                onChange={({ target: { value } }) =>
                  setBathroomsDescription(locale, value)
                }
              />
            </div>
          </li>

          <li className="relative flex items-start gap-s-m">
            <div className="flex items-center justify-center rounded-2xl border border-gray-400 bg-gray-300/5 p-xs-s text-gray-400">
              <FontAwesomeIcon icon={faBed} size="lg" />
            </div>
            <div className="flex-grow space-y-[0.8rem] self-center">
              <ZoozInput
                id="bedrooms-title"
                type="number"
                label={`${t("bedrooms")} ${t("title")}`}
                labelClassName="sr-only"
                containerClassName="border-2 border-gray-300 border-dashed"
                placeholder={`${t("bedrooms")} ⎯ ${t("bedrooms-title-description")}`}
                required
                value={bedrooms}
                onChange={({ target: { value } }) => setBedrooms(Number(value))}
              />

              <ZoozInput
                id="bedrooms-description"
                label={`${t("bedrooms")} ${t("description")}`}
                containerClassName="border-2 border-gray-300 border-dashed"
                labelClassName="sr-only"
                placeholder={`${t("description")} (${t("optional")}) `}
                value={getBedroomsDescription()}
                onChange={({ target: { value } }) =>
                  setBedroomsDescription(locale, value)
                }
              />
            </div>
          </li>

          <li className="relative flex items-start gap-s-m">
            <div className="flex items-center justify-center rounded-2xl border border-gray-400 bg-gray-300/5 p-xs-s text-gray-400">
              <FontAwesomeIcon
                icon={faUpRightAndDownLeftFromCenter}
                size="lg"
              />
            </div>
            <div className="flex-grow space-y-[0.8rem] self-center">
              <ZoozInput
                id="area-title"
                type="number"
                label={`${t("area")} ${t("title")}`}
                labelClassName="sr-only"
                containerClassName="border-2 border-gray-300 border-dashed"
                placeholder={`${t("area")} ⎯ ${t("area-title-description")}`}
                required
                value={area}
                onChange={({ target: { value } }) => setArea(Number(value))}
              />

              <ZoozInput
                id="area-description"
                label={`${t("area")} ${t("description")}`}
                containerClassName="border-2 border-gray-300 border-dashed"
                labelClassName="sr-only"
                placeholder={`${t("description")} (${t("optional")}) `}
                value={getAreaDescription()}
                onChange={({ target: { value } }) =>
                  setAreaDescription(locale, value)
                }
              />
            </div>
          </li>

          <li className="relative flex items-start gap-s-m">
            <div className="flex items-center justify-center rounded-2xl border border-gray-400 bg-gray-300/5 p-xs-s text-gray-400">
              <FontAwesomeIcon icon={faCouch} size="lg" />
            </div>
            <div className="flex-grow space-y-[0.8rem] self-center">
              <ZoozCheckbox
                id="furnished-title"
                label={t("furnished")}
                required
                checked={furnished}
                onChange={({ target: { checked } }) => setFurnished(!!checked)}
              />

              <ZoozInput
                id="furnished-description"
                label={`${t("furnished")} ${t("description")}`}
                containerClassName="border-2 border-gray-300 border-dashed"
                labelClassName="sr-only"
                placeholder={`${t("description")} (${t("optional")}) `}
                value={getFurnishedDescription()}
                onChange={({ target: { value } }) =>
                  setFurnishedDescription(locale, value)
                }
              />
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
