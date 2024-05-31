"use client";

import Button from "@/components/shared/button";
import Spinner from "@/components/shared/spinner";
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
import { useEffect, useState } from "react";

export default function SaveButton() {
  const t = useTranslations("dashboard.create-listing");
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as Locale;
  const agency = params.agency as string;
  const { translateTo } = useCreateListingTranslator();
  const router = useRouter();
  const state = useCreateListingStore();
  const { pictures, translated } = state;
  const [pending, setPending] = useState(false);

  // prevents the agent from filling in the english version
  // before having filled in the arabic version first
  useEffect(() => {
    if (!validateArabic() && locale === "en") {
      router.replace(pathname, { locale: "ar" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, t, router, pathname]);

  useEffect(() => {
    console.log("availabilities =======> ", state.availabilities);
  }, [state.availabilities]);

  async function handleClick() {
    try {
      setPending(true);

      if (Number(state.yearBuilt) > 2030 || Number(state.yearBuilt) < 1900) {
        showToast({
          status: "info",
          message: t("year-built-invalid"),
        });
        return;
      }

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
    } catch (e) {
      console.error(e);
    } finally {
      setPending(false);
    }
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
      state.reset();
      if (message.status === "success") {
        router.push(`/${agency}/listings`);
      }
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
      !!state.availabilities?.length
    );
  }

  function validateArabic() {
    for (const feature of state?.extraFeatures ?? []) {
      if (!feature.arTitle) {
        return false;
      }
    }

    const { arDescription } = state;
    if (!arDescription) return false;

    return true;
  }

  function validateEnglish(): Boolean {
    for (const feature of state?.extraFeatures ?? []) {
      if (!feature.enTitle) {
        return false;
      }
    }
    const {
      arYearBuiltDescription,
      arBedroomsDescription,
      arBathroomsDescription,
      arAreaDescription,
      arFurnishedDescription,

      enDescription,
      enYearBuiltDescription,
      enBedroomsDescription,
      enBathroomsDescription,
      enAreaDescription,
      enFurnishedDescription,
    } = state;

    if (!enDescription) return false;
    if (arYearBuiltDescription && !enYearBuiltDescription) return false;
    if (arBedroomsDescription && !enBedroomsDescription) return false;
    if (arBathroomsDescription && !enBathroomsDescription) return false;
    if (arAreaDescription && !enAreaDescription) return false;
    if (arFurnishedDescription && !enFurnishedDescription) return false;

    return true;
  }

  return (
    <Button
      className="fixed bottom-l-xl end-m-l z-20 flex items-center justify-center gap-2xs-xs"
      onClick={handleClick}
      type="submit"
      disabled={pending}
    >
      {pending && <Spinner size={24} />} {t("save")}
    </Button>
  );
}
