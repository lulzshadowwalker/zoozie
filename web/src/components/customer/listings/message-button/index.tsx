"use client";

import Button from "@/components/shared/button";
import { useCustomerStartConversation } from "@/lib/store/customer-messages";
import { TAgency } from "@/lib/types";
import { useTranslations } from "next-intl";

type Props = {
  agency: TAgency;
};

export default function MessageButton({ agency }: Props) {
  const t = useTranslations("customer.listings");
  const { startConversation } = useCustomerStartConversation();

  function handleStartConversation() {
    if (!agency.id) {
      console.error("ChatTile: conversation agency id cannot be empty");
      return;
    }

    startConversation(agency.id);
  }

  return (
    <Button
      onClick={handleStartConversation}
      className="mt-xl-2xl w-full py-xs-s lg:py-3xs-2xs"
    >
      {t("message")}
    </Button>
  );
}
