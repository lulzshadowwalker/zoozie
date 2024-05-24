"use client";

import LoadingSkeleton from "./components/error-skeleton";
import { useTranslations } from "next-intl";
import { useCustomerMessagesStore } from "@/lib/store/customer-messages";
import { ChatTile } from "./components/chat-tile";

export function PreviousConversations() {
  const t = useTranslations("customer.messages");
  const previousConversations = useCustomerMessagesStore(
    (state) => state.previousConversations,
  );

  if (!previousConversations) {
    return <LoadingSkeleton />;
  }

  const hasConversations = previousConversations.length > 0;

  return (
    <section className="relative h-full w-full max-w-[40rem] space-y-xs-s overflow-scroll border-e border-gray-100 px-3xs-2xs py-2xs-xs">
      {!hasConversations && (
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-500">
          {t("no-conversations")}
        </p>
      )}

      {hasConversations &&
        previousConversations?.map((conversation, index) => (
          <ChatTile key={index} conversation={conversation} />
        ))}
    </section>
  );
}
