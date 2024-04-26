"use client";

import Button from "@/components/shared/button";
import ZoozCheckbox from "@/components/shared/zooz-checkbox";
import ZoozInput from "@/components/shared/zooz-input";
import { Locale } from "@/lib/i18n/config";
import { useCreateListingStore } from "@/lib/store/create-listing";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

// Extra Features aka amenities
export default function ExtraFeatures() {
  const t = useTranslations("dashboard.create-listing");
  const params = useParams();
  const locale = params.locale as Locale;

  const addExtraFeature = useCreateListingStore(
    (state) => state.addExtraFeature,
  );
  const updateExtraFeature = useCreateListingStore(
    (state) => state.updateExtraFeature,
  );
  const removeExtraFeature = useCreateListingStore(
    (state) => state.removeExtraFeature,
  );
  const extraFeatures = useCreateListingStore((state) => state.extraFeatures);

  const hasFeatures = !!extraFeatures?.length;
  const lastFeature = extraFeatures?.[extraFeatures?.length - 1];
  const lastFeatureHasValue = !!(locale === "en"
    ? lastFeature?.enTitle
    : lastFeature?.arTitle);

  return (
    <section className="mt-l-xl border-t pt-l-xl">
      <h2 className="mb-m-l text-xl font-medium">{t("extra-features")}</h2>

      <ul className="space-y-s-m">
        {extraFeatures?.map((feature, index) => (
          <li className="relative flex items-center gap-xs-s" key={index}>
            <ZoozCheckbox
              id={`checkbox-input-${feature.id.toString()}`}
              label={`${t("extra-feature")} ${index + 1}`}
              labelClassName="sr-only"
              checked={feature.exists}
              onChange={({ target: { checked } }) =>
                updateExtraFeature({ ...feature, exists: checked })
              }
            />

            <ZoozInput
              id={`title-input-${feature.id.toString()}`}
              label={t("title-input")}
              labelClassName="sr-only"
              containerClassName="border-2 border-gray-300 border-dashed"
              placeholder={t("additional-feature")}
              required
              value={locale === "en" ? feature.enTitle : feature.arTitle}
              onChange={({ target: { value } }) => {
                if (locale === "en") {
                  updateExtraFeature({ ...feature, enTitle: value });
                } else {
                  updateExtraFeature({ ...feature, arTitle: value });
                }
              }}
            />

            <Button
              typ="secondary"
              square
              className="absolute end-0 flex h-[3rem] w-[3rem] -translate-y-1/2 translate-x-1/2 items-center justify-center hover:bg-red-400 hover:text-gray-50 focus:bg-red-200 focus:text-gray-50 rtl:-translate-x-1/2"
              onClick={() => removeExtraFeature(feature)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </li>
        ))}

        <li className="mt-m-l">
          <button
            className="border-gray-300 text-gray-400 outline-none transition-all focus:border-on-primary-1 focus:text-on-primary-1"
            type="button"
            onClick={() => addExtraFeature(locale)}
            disabled={hasFeatures && (!lastFeatureHasValue ?? false)}
          >
            <FontAwesomeIcon
              icon={faPlus}
              size="lg"
              className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-inherit bg-gray-50 p-xs-s transition-all hover:bg-gray-100"
            />
          </button>
        </li>
      </ul>
    </section>
  );
}
