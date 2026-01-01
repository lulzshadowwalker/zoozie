"use client";

import { useCustomerMessagesStore } from "@/lib/store/customer-messages";
import { ChatViewMessage } from "../chat-view-message";
import { useEffect, useRef } from "react";

export default function ChatViewBody() {
  const { conversation } = useCustomerMessagesStore();
  const messages = conversation?.messages;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(
    function scrollToBottom() {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [conversation?.messages],
  );

  return (
    <section className="flex-grow space-y-2xs-xs overflow-scroll px-xs-s py-s-m">
      {messages?.map((message, index) => (
        <ChatViewMessage key={index} message={message} />
      ))}

      <div ref={bottomRef} />
    </section>
  );
}
