"use client";

import { useCustomerMessagesStore } from "@/lib/store/customer-messages";
import ChatViewHeader from "../chat-view-header";
import { PreviousConversations } from "../previous-conversations";
import ChatViewBody from "../chat-view-body";
import ChatViewInput from "../chat-view-input";

export default function ChatView() {
  const conversation = useCustomerMessagesStore((state) => state.conversation);
  const isOpen = useCustomerMessagesStore((state) => state.isOpen);
  if (!isOpen) return <></>;

  return (
    <section className="fixed bottom-l-xl right-l-xl z-20 flex h-[428px] w-[340px] flex-col overflow-hidden rounded-2xl border-[0.5px] border-gray-300 bg-primary-1 drop-shadow-sm">
      <ChatViewHeader />
      {conversation ? (
        <>
          <ChatViewBody />
          <ChatViewInput />
        </>
      ) : (
        <PreviousConversations />
      )}
    </section>
  );
}
