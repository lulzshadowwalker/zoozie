"use client";

import ZoozTextarea from "@/components/shared/zooz-textarea";
import { Locale } from "@/lib/i18n/config";
import { useCreateListingStore } from "@/lib/store/create-listing";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function DescriptionInput() {
  const t = useTranslations("dashboard.create-listing");
  const params = useParams();
  const locale = params.locale as Locale;
  const { setDescription, descriptionEn, descriptionAr } =
    useCreateListingStore(
      ({
        setDescription,
        arDescription: descriptionAr,
        enDescription: descriptionEn,
      }) => ({
        setDescription,
        descriptionAr,
        descriptionEn,
      }),
    );
  const description = locale === "en" ? descriptionEn : descriptionAr;

  return (
    <article className="mt-l-xl border-t pt-l-xl">
      <h2 className="text-xl font-medium">{t("about-this-home")}</h2>
      <ZoozTextarea
        id="description"
        label={t("listing-description")}
        labelClassName="sr-only"
        containerClassName="text-lg text-gray-500 min-w-readable mt-s-m border-2 border-gray-300 border-dashed"
        onChange={({ target: { value } }) => setDescription(locale, value)}
      >
        {description}
      </ZoozTextarea>
    </article>
  );
}
