"use client";

import Button from "@/components/shared/button";
import ZoozCheckbox from "@/components/shared/zooz-checkbox";
import ZoozInput from "@/components/shared/zooz-input";
import { useCreateListing } from "@/lib/context/create-listing";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

// Extra Features aka amenities
export default function ExtraFeatures() {
  const t = useTranslations("dashboard.create-listing");
  const {
    addExtraFeature,
    updateExtraFeature,
    removeExtraFeature,
    extraFeatures,
  } = useCreateListing();

  const hasFeatures = !!extraFeatures?.length;
  const lastFeatureHasValue =
    !!extraFeatures?.[extraFeatures?.length - 1]?.title;

  return (
    <section className="mt-l-xl pt-l-xl border-t">
      <h2 className="text-xl font-medium mb-m-l">{t("extra-features")}</h2>

      <ul>
        {extraFeatures?.map((feature, index) => (
          <li className="flex items-center gap-xs-s relative" key={index}>
            <ZoozCheckbox
              id={`checbox-input-${feature.id.toString()}`}
              label={`${t("extra-feature")} ${index + 1}`}
              labelClassName="sr-only"
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
              onChange={({ target: { value } }) =>
                updateExtraFeature({ ...feature, title: value })
              }
            />

            <Button
              typ="secondary"
              square
              className="absolute end-0 translate-x-1/2 -translate-y-1/2 h-[3rem] w-[3rem] flex items-center justify-center hover:bg-red-400 hover:text-gray-50 focus:bg-red-200 focus:text-gray-50"
              onClick={() => removeExtraFeature(feature)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </li>
        ))}

        <li className="mt-m-l">
          <button
            className="outline-none transition-all text-gray-400 border-gray-300 focus:text-on-primary-1 focus:border-on-primary-1"
            type="button"
            onClick={addExtraFeature}
            disabled={hasFeatures && (!lastFeatureHasValue ?? false)}
          >
            <FontAwesomeIcon
              icon={faPlus}
              size="lg"
              className="border-inherit border-2 border-dashed bg-gray-50 rounded-2xl p-xs-s flex items-center justify-center transition-all hover:bg-gray-100 cursor-pointer"
            />
          </button>
        </li>
      </ul>
    </section>
  );
}
