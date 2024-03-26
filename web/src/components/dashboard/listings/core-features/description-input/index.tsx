"use client";

import ZoozTextarea from "@/components/shared/zooz-textarea";
import { useCreateListing } from "@/lib/context/create-listing";
import { useTranslations } from "next-intl";

export default function DescriptionInput() {
  const t = useTranslations("dashboard.create-listing");
  const { setDescription } = useCreateListing();

  return (
    <article className="mt-l-xl pt-l-xl border-t">
      <h2 className="text-xl font-medium">{t("about-this-home")}</h2>
      <ZoozTextarea
        id="description"
        label={t("listing-description")}
        labelClassName="sr-only"
        containerClassName="text-lg text-gray-500 min-w-readable mt-s-m border-2 border-gray-300 border-dashed"
        onChange={({ target: { value } }) => setDescription(value)}
      />
    </article>
  );
}
