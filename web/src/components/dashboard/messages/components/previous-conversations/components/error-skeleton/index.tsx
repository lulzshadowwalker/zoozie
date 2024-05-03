"use client";

import { useEffect } from "react";
import { ChatTileSkeleton } from "../../../chat-tile-skeleton";
import { showToast } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function ErrorSkeleton() {
  const t = useTranslations("dashboard.messages");
  useEffect(
    function handleShowErrorToast() {
      showToast({
        status: "failure",
        message: t("failed-to-load-previous-messages"),
      });
    },
    [t],
  );

  return (
    <section className="w-full max-w-[40rem] space-y-xs-s overflow-scroll border-e border-gray-100 px-s-m py-m-l">
      {[...Array(69)].map((_, index) => (
        <ChatTileSkeleton key={index} />
      ))}
    </section>
  );
}
