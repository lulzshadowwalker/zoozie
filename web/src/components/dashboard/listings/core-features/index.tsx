"use client";

import ZoozInput from "@/components/shared/zooz-input";
import { useFetchApi } from "@/lib/api";
import { TCoreFeature } from "@/lib/types";
import { cn } from "@/lib/utils";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useCreateListing } from "@/lib/context/create-listing";
import Button from "@/components/shared/button";

// TODO: label translations

export default function CoreFeatures() {
  // FIXME: `useFetchApi("/listings/core-features")` doesn't seem to actually cache the response
  const {
    data: payload,
    isLoading,
    error,
  } = useFetchApi("/listings/core-features");
  const t = useTranslations("dashboard.create-listing");

  // NOTE: features: data from the api, coreFeatures: state from the useCreatiListingContext
  const {
    coreFeatures,
    addCoreFeatures,
    updateCoreFeature,
    removeCoreFeature,
  } = useCreateListing();
  const features = payload?.data?.coreFeatures as TCoreFeature[] | undefined;

  const [requiredFeatures, optionalFeatures] = useMemo(() => {
    const required = features?.filter((a) => a.required);
    const optional = features?.filter((a) => !a.required);

    return [required, optional];
  }, [features]);

  useEffect(
    function setCoreFeaturesState() {
      // NOTE: this check if the `CreateListningContext` is already intialized with `coreFeatures`
      // if not add the required coreFeatures from the api
      if (!coreFeatures?.[0] && requiredFeatures) {
        addCoreFeatures(...requiredFeatures);
      }
    },
    [requiredFeatures, coreFeatures, addCoreFeatures],
  );

  if (isLoading) {
    return <h1>Shimmer</h1>;
  }

  if (error) {
    throw new Error("failed to fetch core features because " + error);
  }

  if (!features) {
    throw new Error("core features cannot be empty");
  }

  return (
    <section className="mt-l-xl pt-l-xl border-t flex items-start">
      <div className="flex-grow">
        <h2 className="text-xl font-medium">What this place offers</h2>
        <ul className="flex flex-col gap-m-l mt-m-l">
          {coreFeatures?.map((feature, index) => {
            const { name, description, required, icon } = feature;

            return (
              <li className="flex items-start gap-s-m relative" key={index}>
                <div className="border border-gray-400 bg-gray-300/5 rounded-2xl p-xs-s text-gray-400 flex items-center justify-center">
                  <Image
                    src={icon ?? ""}
                    title={name ?? ""}
                    alt={name ?? ""}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="self-center space-y-[0.8rem] flex-grow">
                  <ZoozInput
                    id={`core-feature-title-${index}`}
                    label={`${name} ${t("title")}`}
                    labelClassName="sr-only"
                    containerClassName="border-2 border-gray-300 border-dashed"
                    placeholder={
                      description ??
                      `${name ?? ""} ⎯ ${t("core-feature-title")}`
                    }
                    required={required}
                    onChange={({ target: { value } }) =>
                      // TODO: use an id instead of name
                      updateCoreFeature({ ...feature, titleInput: value })
                    }
                  />
                  <ZoozInput
                    id={`core-feature-description-${index}`}
                    label={`${name} ${t("description")}`}
                    containerClassName="border-2 border-gray-300 border-dashed"
                    labelClassName="sr-only"
                    placeholder={`${name} - ${t("core-feature-description")} (optional)`}
                    onChange={({ target: { value } }) =>
                      // TODO: use an id instead of name
                      updateCoreFeature({ ...feature, descriptionInput: value })
                    }
                  />
                </div>

                {!feature.required && (
                  <Button
                    typ="secondary"
                    square
                    className="absolute end-0 translate-x-1/2 -translate-y-1/2 h-[3rem] w-[3rem] flex items-center justify-center hover:bg-red-400 hover:text-gray-50 focus:bg-red-200 focus:text-gray-50"
                    onClick={() => removeCoreFeature(feature)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </Button>
                )}
              </li>
            );
          })}

          {optionalFeatures && (
            <li
              className="flex items-start gap-s-m"
              title={t("add-core-feature")}
            >
              <CoreFeaturesDropdown features={optionalFeatures} />
            </li>
          )}

          <li title={t("add-core-feature")}></li>
        </ul>
      </div>
    </section>
  );
}

function CoreFeaturesDropdown({
  features,
}: {
  features: Partial<TCoreFeature>[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { coreFeatures, addCoreFeatures } = useCreateListing();

  const notIncludedFeatures = useMemo(() => {
    return features.filter(
      (feature) => !coreFeatures?.find((a) => a.name === feature.name),
    );
  }, [coreFeatures, features]);

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  function insertFeature(feature: Partial<TCoreFeature>) {
    addCoreFeatures(feature);
    toggleMenu();
  }

  if (!notIncludedFeatures?.length) {
    return <></>;
  }

  return (
    <div className="relative">
      <button
        id="optional-features-dropdown"
        className="outline-none transition-all text-gray-400 border-gray-300 focus:text-on-primary-1 focus:border-on-primary-1"
        type="button"
        onClick={toggleMenu}
      >
        <FontAwesomeIcon
          icon={faPlus}
          size="lg"
          className="border-inherit border-2 border-dashed bg-gray-50 rounded-2xl p-xs-s flex items-center justify-center transition-all hover:bg-gray-100 cursor-pointer"
        />
      </button>

      <div
        id="dropdown"
        className={cn(
          "absolute start-[6rem] top-0 z-10 bg-primary-1 divide-y divide-gray-100 rounded-lg shadow w-[28rem] dark:shadow-none dark:bg-gray-700",
          {
            hidden: !isOpen,
          },
        )}
      >
        <ul
          className="py-4 text-lg text-on-primary-1/80"
          aria-labelledby="optional-features-dropdown"
        >
          {notIncludedFeatures?.map((feature, index) => (
            <li key={index} className="block">
              <button
                className="w-full flex px-4 py-3 outline-none transition-all hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-600 dark:focus:text-white"
                onClick={() => insertFeature(feature)}
              >
                {feature.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
