import { ChatView } from "@/components/dashboard/messages/components/chat-view";
import { PreviousConversations } from "@/components/dashboard/messages/components/previous-conversations";
import Header from "@/components/dashboard/shared/header";
import { Forbidden, TokenNotFound, authenticate, forbidden } from "@/lib/auth";
import { redirect } from "@/lib/i18n/navigation";
import { IBaseAgencyParams, IBasePageParams } from "@/lib/types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";

export default async function Messages({
  params: { locale, agency },
}: IBaseAgencyParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("dashboard.messages");
  try {
    const claims = await authenticate(cookies().get("access-token")?.value);
    if (claims.agencySlug !== agency) forbidden();
  } catch (e) {
    if (e instanceof Forbidden) redirect("/403");
    if (e instanceof TokenNotFound) redirect("/auth/register");
    throw e;
  }

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
