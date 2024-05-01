import { getTranslations } from "next-intl/server";
import { ChatViewBody } from "../chat-view-body";
import { ChatViewHeader } from "../chat-view-header";
import { ChatViewInput } from "../chat-view-input";

export async function ChatView() {
  const t = await getTranslations("dashboard.messages");

  return (
    <section className="flex flex-grow flex-col bg-gray-200 p-l-xl">
      <ChatViewHeader />
      <ChatViewBody />
      <ChatViewInput />
    </section>
  );
}
