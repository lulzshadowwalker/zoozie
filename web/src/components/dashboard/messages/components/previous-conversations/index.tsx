import { getAccessToken } from "@/lib/actions/auth";
import { ChatTile } from "../chat-tile";
import { getTranslations } from "next-intl/server";
import { fetchApi } from "@/lib/api";
import ErrorSkeleton from "./components/error-skeleton";
import { TConversation } from "@/lib/types";

export async function PreviousConversations() {
  const t = await getTranslations("dashboard.messages");
  const accessToken = await getAccessToken();
  console.error();
  if (!accessToken) {
    console.error("PreviousConversations: no access token");
    return <ErrorSkeleton />;
  }

  const res = await fetchApi("/conversations", {
    init: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    queryParams: {
      expand: ["customer", "agency"],
    },
  });
  if (!res.ok) {
    console.error(
      "PreviousConversations: failed to fetch conversations. status code:",
      res.status,
    );
    return <ErrorSkeleton />;
  }

  const conversations = (await res.json())?.data?.conversations as
    | TConversation[]
    | undefined;
  if (!conversations) {
    console.error(
      "PreviousConversations: response is not in the expected format",
    );
    return <ErrorSkeleton />;
  }

  // TODO: NOW: Add Conversation with optional Customer, Agency, and Messages to `types.ts`
  const hasConversations = conversations.length > 0;

  return (
    <section className="relative w-full max-w-[40rem] space-y-xs-s overflow-scroll border-e border-gray-100 px-s-m py-m-l">
      {!hasConversations && (
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-500">
          {t("no-conversations")}
        </p>
      )}

      {hasConversations &&
        conversations?.map((conversation, index) => (
          <ChatTile
            key={index}
            active={index === 0}
            conversation={conversation}
          />
        ))}
    </section>
  );
}
