"use client";

import ZoozInput from "@/components/shared/zooz-input";
import { useCreateListingStore } from "@/lib/store/create-listing";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

export default function Price() {
  const t = useTranslations("dashboard.create-listing");
  const tCurrency = useTranslations("currency");

  const { availabilities, addAvailability, removeAvailability } =
    useCreateListingStore(
      ({ addAvailability, removeAvailability, availabilities }) => ({
        addAvailability,
        removeAvailability,
        availabilities,
      }),
    );
  const [rentPrice, setRentPrice] = useState(
    availabilities?.find((a) => a.availability === "RENT")?.price?.amount,
  );
  const [salePrice, setSalePrice] = useState(
    availabilities?.find((a) => a.availability === "SALE")?.price?.amount,
  );

  return (
    <>
      <div className="mb-xs-s border-b-2 border-dashed pb-xs-s text-xl">
        <ZoozInput
          id="price"
          type="number"
          label={t("price")}
          labelClassName="sr-only"
          containerClassName="inline border-2 border-gray-300 border-dashed"
          inputClassName="max-w-[10rem]"
          value={rentPrice}
          onChange={({ target: { value } }) => {
            setRentPrice(parseInt(value));
            if (!value) {
              removeAvailability("RENT");
            }

            return addAvailability({
              availability: "RENT",
              price: {
                amount: Number(value),
                currency: "JOD",
              },
            });
          }}
        />{" "}
        {tCurrency("jod")}
        <span className="text-base font-light text-gray-500">
          {" "}
          {t("rent-price")}
        </span>
      </div>

      <div className="mb-s-m border-b-2 pb-s-m text-xl">
        <ZoozInput
          id="price"
          type="number"
          label={t("price")}
          labelClassName="sr-only"
          containerClassName="inline border-2 border-gray-300 border-dashed"
          inputClassName="max-w-[10rem]"
          value={salePrice}
          onChange={({ target: { value } }) => {
            setSalePrice(parseInt(value));
            if (!value) {
              removeAvailability("SALE");
            }

            return addAvailability({
              availability: "SALE",
              price: {
                amount: Number(value),
                currency: "JOD",
              },
            });
          }}
        />{" "}
        {tCurrency("jod")}
        <span className="text-base font-light text-gray-500">
          {" "}
          {t("sale-price")}
        </span>
      </div>
    </>
  );
}
