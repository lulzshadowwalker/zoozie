"use client";

import Button from "@/components/shared/button";
import { createListing } from "@/lib/actions/create-listing";
import { Locale } from "@/lib/i18n/config";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import {
  useCreateListingStore,
  useCreateListingTranslator,
} from "@/lib/store/create-listing";
import { CreateListingRequestPayload } from "@/lib/types";
import { showToast } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function SaveButton() {
  const t = useTranslations("dashboard.create-listing");
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as Locale;
  const { translateTo } = useCreateListingTranslator();
  const router = useRouter();
  const state = useCreateListingStore();
  const { pictures, translated } = state;

  // prevents the agent from filling in the english version
  // before having filled in the arabic version first
  useEffect(() => {
    if (!validateArabic() && locale === "en") {
      router.replace(pathname, { locale: "ar" });
    }
  }, [locale, t, router, pathname]);

  async function handleClick() {
    if (!validateCommon() || !validateArabic!()) {
      showToast({
        status: "info",
        message: t("fill-in-the-details"),
      });
      return;
    }

    if (!pictures) {
      showToast({
        status: "info",
        message: t("please-add-pictures"),
      });
      return;
    }

    if (!translated) {
      await translateTo("en");
      router.push(pathname, { locale: "en" });
    }

    if (!validateEnglish()) {
      showToast({
        status: "info",
        message: t("fill-in-the-details"),
      });
      return;
    }

    await handleSubmit();
  }

  async function handleSubmit() {
    try {
      const payload: Omit<CreateListingRequestPayload, "pictures"> = {
        descriptionEnglish: state.enDescription!,
        descriptionArabic: state.arDescription!,
        bedrooms: state.bedrooms!,
        bathrooms: state.bathrooms!,
        yearBuilt: Number(state.yearBuilt!),
        area: state.area!,
        furnished: state.furnished ?? false,
        availabilities: state.availabilities!,
        extraFeatures:
          state.extraFeatures?.map((feature) => ({
            id: feature.id,
            titleEnglish: feature.enTitle!,
            titleArabic: feature.arTitle!,
            exists: feature.exists,
          })) ?? [],
        location: state.location as CreateListingRequestPayload["location"],
        type: state.propertyType!,
        bedroomsDescriptionArabic: state.arBedroomsDescription ?? null,
        bedroomsDescriptionEnglish: state.enBedroomsDescription ?? null,
        bathroomsDescriptionArabic: state.arBathroomsDescription ?? null,
        bathroomsDescriptionEnglish: state.enBathroomsDescription ?? null,
        yearBuiltDescriptionArabic: state.arYearBuiltDescription ?? null,
        yearBuiltDescriptionEnglish: state.enYearBuiltDescription ?? null,
        areaDescriptionArabic: state.arAreaDescription ?? null,
        areaDescriptionEnglish: state.enAreaDescription ?? null,
        furnishedDescriptionArabic: state.arFurnishedDescription ?? null,
        furnishedDescriptionEnglish: state.enFurnishedDescription ?? null,
      };

      const picturesForm = new FormData();
      for (const p of pictures!) {
        picturesForm.append("files", p);
      }

      const action = createListing.bind(null, {
        payload,
        picturesForm,
      });
      const message = await action();
      showToast(message);
    } catch (e) {
      console.error("handleSubmit: ", e);
      showToast({
        status: "warning",
        message: t("bad-request"),
      });
      return;
    }
  }

  // validates common fields between both languages
  function validateCommon() {
    return (
      !!state.bedrooms &&
      !!state.bathrooms &&
      !!state.yearBuilt &&
      !!state.area &&
      !!state.furnished &&
      !!state.availabilities?.length
    );
  }

  function validateArabic() {
    const {
      arDescription,
      arYearBuiltDescription,
      arBedroomsDescription,
      arBathroomsDescription,
      arAreaDescription,
      arFurnishedDescription,
    } = state;

    for (const feature of state?.extraFeatures ?? []) {
      if (!feature.arTitle) {
        return false;
      }
    }

    return (
      !!arDescription &&
      !!arYearBuiltDescription &&
      !!arBedroomsDescription &&
      !!arBathroomsDescription &&
      !!arAreaDescription &&
      !!arFurnishedDescription
    );
  }

  function validateEnglish() {
    const {
      enDescription,
      enYearBuiltDescription,
      enBedroomsDescription,
      enBathroomsDescription,
      enAreaDescription,
      enFurnishedDescription,
    } = state;

    for (const feature of state?.extraFeatures ?? []) {
      if (!feature.enTitle) {
        return false;
      }
    }

    return (
      !!enDescription &&
      !!enYearBuiltDescription &&
      !!enBedroomsDescription &&
      !!enBathroomsDescription &&
      !!enAreaDescription &&
      !!enFurnishedDescription
    );
  }

  return (
    <Button
      className="fixed bottom-l-xl end-m-l z-20"
      onClick={handleClick}
      type="submit"
    >
      {t("save")}
    </Button>
  );
}
