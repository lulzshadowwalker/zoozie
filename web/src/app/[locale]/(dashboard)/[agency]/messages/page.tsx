import { ChatView } from "@/components/dashboard/messages/components/chat-view";
import { PreviousConversations } from "@/components/dashboard/messages/components/previous-conversations";
import Header from "@/components/dashboard/shared/header";
import { IBasePageParams } from "@/lib/types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function Messages({
  params: { locale },
}: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("dashboard.messages");

  return (
    <main>
      <Header leading={<h1 className="text-2xl">{t("messages")}</h1>} />
      <section className="flex h-[calc(100dvh-7.412rem)]">
        <PreviousConversations />
        <ChatView />
      </section>
    </main>
  );
}
