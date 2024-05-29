"use client";

import Button from "@/components/shared/button";
import { useUser } from "@/lib/context/user";
import { useToastHelpers } from "@/lib/hooks";
import { useCustomerStartConversation } from "@/lib/store/customer-messages";
import { TAgency } from "@/lib/types";
import { useTranslations } from "next-intl";

type Props = {
  agency: TAgency;
};

export default function MessageButton({ agency }: Props) {
  const t = useTranslations("customer.agency");
  const { claims } = useUser();
  const { showAgentRestrictionToast } = useToastHelpers();
  const { startConversation } = useCustomerStartConversation();

  function handleStartConversation() {
    if (claims?.value?.role !== "CUSTOMER") {
      showAgentRestrictionToast();
      return;
    }

    if (!agency?.id) {
      console.error("MessageButton: conversation agency id cannot be empty");
      return;
    }

    startConversation(agency.id);
  }

  return (
    <Button
      onClick={handleStartConversation}
      className="ms-0 flex-grow basis-0 py-xs-s md:flex-grow-0 md:py-3xs-2xs"
    >
      {t("message")}
    </Button>
  );
}
