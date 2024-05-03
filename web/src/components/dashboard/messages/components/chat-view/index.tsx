"use client";

import { useDashboardMessagesStore } from "@/lib/store/dashboard-messages";
import { ChatViewBody } from "../chat-view-body";
import { ChatViewHeader } from "../chat-view-header";
import { ChatViewInput } from "../chat-view-input";
import { useTranslations } from "next-intl";

export function ChatView() {
  const conversation = useDashboardMessagesStore((state) => state.conversation);
  const t = useTranslations("dashboard.messages");

  return (
    <section className="flex flex-grow flex-col bg-gray-200 p-l-xl">
      {
        conversation && (
          <>
            <ChatViewHeader />
            <ChatViewBody />
            <ChatViewInput />
          </>
        )
      }

    </section>
  );
}
