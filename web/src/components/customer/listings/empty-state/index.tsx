"use client";
import Lottie from "lottie-react";
import animation from "../../../../../public/assets/animations/girl-empty-box.json";
import { useTranslations } from "next-intl";

export default function EmptyState() {
  const t = useTranslations("customer.listings");

  return (
    <section className="mx-auto my-l-xl max-w-screen-sm px-s-m">
      <Lottie
        animationData={animation}
        loop={true}
        className="mx-auto max-w-xl"
      />
      <h1 className="text-center text-2xl font-medium">
        {t("empty-state.title")}
      </h1>
      <p className="max-w-readable text-center text-lg font-light text-gray-500">
        {t("empty-state.description")}
      </p>
    </section>
  );
}
