"use client";

import ZoozInput from "@/components/shared/zooz-input";
import { useCreateListing } from "@/lib/context/create-listing";
import { useTranslations } from "next-intl";

export default function Price() {
  const t = useTranslations("dashboard.create-listing");
  const tCurrency = useTranslations("currency");

  const { setPrice } = useCreateListing();

  return (
    <div className="text-xl mb-xs-s pb-xs-s border-b-2">
      <ZoozInput
        id="price"
        label={t("price")}
        labelClassName="sr-only"
        containerClassName="inline border-2 border-gray-300 border-dashed"
        inputClassName="max-w-[10rem]"
        onChange={({ target: { value } }) =>
          setPrice({ amount: +value, currency: "JOD" })
        }
      />{" "}
      {tCurrency("jod")}
    </div>
  );
}
