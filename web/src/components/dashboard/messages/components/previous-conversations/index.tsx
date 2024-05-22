"use client";

import { ChatTile } from "../chat-tile";
import { generateApiUrl } from "@/lib/api";
import LoadingSkeleton from "./components/error-skeleton";
import { TConversation, TZoozieUserMessage } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useUser } from "@/lib/context/user";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Locale } from "@/lib/i18n/config";
import { showToast } from "@/lib/utils";
import { useDashboardMessagesStore } from "@/lib/store/dashboard-messages";

export function PreviousConversations() {
  const t = useTranslations("dashboard.messages");
  const { accessToken } = useUser();
  const { locale } = useParams();
  const conversation = useDashboardMessagesStore((state) => state.conversation);
  const [conversations, setConversations] = useState<TConversation[] | null>(
    null,
  );

  useEffect(
    function pollConversations() {
      const controller = new AbortController();
      fetchConversations(controller);
      const interval = setInterval(() => fetchConversations(controller), 5000);

      return () => {
        controller.abort("cancelled");
        clearInterval(interval);
      };
    },
    [accessToken.pending, accessToken.value, conversation],
  );

  async function fetchConversations(abortController?: AbortController) {
    const unknownErr: TZoozieUserMessage = {
      status: "failure",
      message: t("failed-to-load-previous-messages"),
    };

    try {
      if (accessToken.pending) return;
      if (!accessToken.value) {
        console.error("PreviousConversations: no access token");
        showToast(unknownErr);
        return;
      }

      const url = generateApiUrl({
        endpoint: "/conversations",
        locale: locale as Locale,
        queryParams: { expand: ["customer", "agency"] },
      });

      const res = await fetch(url.href, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        signal: abortController?.signal,
      });

      if (!res.ok) {
        throw new Error(
          `PreviousConversations: failed to fetch conversations. status code: ${res.status}`,
        );
      }

      const conversations = (await res.json())?.data?.conversations as
        | TConversation[]
        | undefined;
      if (!conversations) {
        throw new Error(
          "previous conversations api response is not in the expected format",
        );
      }

      setConversations(conversations);
    } catch (e) {
      if (abortController?.signal.aborted) return;
      console.error(e);
      showToast(unknownErr);
    }
  }

  if (!conversations) {
    return <LoadingSkeleton />;
  }

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
          <ChatTile key={index} conversation={conversation} />
        ))}
    </section>
  );
}
