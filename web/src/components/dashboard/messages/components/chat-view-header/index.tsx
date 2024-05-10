"use client";

import ZoozImage from "@/components/shared/zooz-image";
import { useDashboardMessagesStore } from "@/lib/store/dashboard-messages";
import { getCustomerImage } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export function ChatViewHeader() {
  const t = useTranslations("dashboard.messages");
  const { conversation } = useDashboardMessagesStore();
  const customer = conversation?.customer;

  return (
    <div className="flex items-center gap-xs-s">
      <div className="relative min-h-xl-2xl w-full max-w-xl-2xl overflow-hidden rounded-full bg-gray-400">
        <ZoozImage
          src={getCustomerImage(customer?.profilePicture)}
          alt={`${customer?.name ?? ""} ${t("avatar")}`}
          title={`${customer?.name ?? ""} ${t("avatar")}`}
          fill
          sizes="(min-width: 1320px) 38px, calc(1.7vw + 16px)"
          quality={65}
          className="object-cover"
        />
      </div>

      <h2 className="text-lg font-medium">
        {customer?.name ?? t("unknown-customer")}
      </h2>
    </div>
  );
}
