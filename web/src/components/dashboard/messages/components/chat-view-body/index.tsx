"use client";

import { ChatViewMessage } from "../chat-view-message";
import { useDashboardMessagesStore } from "@/lib/store/dashboard-messages";

export function ChatViewBody() {
  const conversation = useDashboardMessagesStore((state) => state.conversation);

  return (
    <section className="my-l-xl space-y-l-xl overflow-y-auto scrollbar-hide">
      {conversation?.messages?.map((message, index) => (
        <ChatViewMessage
          key={index}
          message={message}
          customer={conversation?.customer ?? {}}
          agency={conversation?.agency ?? {}}
        />
      ))}
    </section>
  );
}
