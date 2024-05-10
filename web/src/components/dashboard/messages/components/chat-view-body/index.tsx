"use client";

import { useRef, useEffect } from "react";
import { ChatViewMessage } from "../chat-view-message";
import { useDashboardMessagesStore } from "@/lib/store/dashboard-messages";

export function ChatViewBody() {
  const conversation = useDashboardMessagesStore((state) => state.conversation);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(
    function scrollToBottom() {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [conversation?.messages],
  );

  return (
    <section className="my-s-m space-y-l-xl overflow-y-auto scrollbar-hide">
      {conversation?.messages?.map((message, index) => (
        <ChatViewMessage
          key={index}
          message={message}
          customer={conversation?.customer ?? {}}
          agency={conversation?.agency ?? {}}
        />
      ))}
      <div ref={bottomRef} />
    </section>
  );
}
