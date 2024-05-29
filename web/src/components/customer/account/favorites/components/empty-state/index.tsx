"use client";

import Lottie from "lottie-react";
import EmptyStateAnimation from "../../../../../../../public/assets/animations/favorites.json";
import { useTranslations } from "next-intl";

export default function EmptyState() {
  const t = useTranslations("customer.account-favorites");

  return (
    <section className="mx-auto mb-xl-2xl max-w-screen-sm px-s-m">
      <Lottie
        animationData={EmptyStateAnimation}
        loop={true}
        className="mx-auto max-w-3xl"
      />
      <h1 className="text-center text-3xl font-medium">
        {t("empty-state-title")}
      </h1>
      <p className="max-w-readable text-center text-lg font-light text-gray-500">
        {t("empty-state-description")}
      </p>
    </section>
  );
}
