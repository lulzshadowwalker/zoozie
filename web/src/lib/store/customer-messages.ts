import { create } from "zustand";
import {
  TConversation,
  TConversationMessage,
  TZoozieUserMessage,
} from "../types";
import { generateApiUrl } from "../api";
import { Locale } from "../i18n/config";
import { showToast } from "../utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useUser } from "../context/user";

type TState = {
  conversation: TConversation | null;
  previousConversations?: TConversation[];
  isOpen?: boolean;
};

type TActions = {
  setConversation(conversation: TConversation | null): void;
  setPreviousConversations(conversations: TConversation[]): void;
  appendMessage(message: TConversationMessage): void;
  setIsOpen(isOpen: boolean): void;
};

export const useCustomerMessagesStore = create<TState & TActions>((set) => ({
  conversation: null,
  setConversation: (conversation) => set({ conversation }),
  setPreviousConversations: (conversations) =>
    set({ previousConversations: conversations }),
  appendMessage: (message) =>
    set((state) => ({
      ...state,
      conversation: {
        ...state?.conversation,
        latestMessage: message,
        messages: [...(state?.conversation?.messages ?? []), message],
      },
    })),
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export function useCustomerStartConversation() {
  const t = useTranslations("dashboard.messages");
  const { locale } = useParams();
  const { accessToken } = useUser();
  const setConversation = useCustomerMessagesStore(
    (state) => state.setConversation,
  );
  const setIsOpen = useCustomerMessagesStore((state) => state.setIsOpen);

  async function startConversation(agencyId?: number) {
    if (typeof window === "undefined" || accessToken.pending) return;

    const failureMessage: TZoozieUserMessage = {
      status: "failure",
      message: t("failed-to-load-message-history"),
    };
    if (!accessToken.value) {
      console.error("ChatViewBody: no access token");
      showToast(failureMessage);
      return;
    }

    const url = generateApiUrl({
      endpoint: `/conversations/${agencyId}`,
      locale: locale as Locale,
      queryParams: { expand: ["agency", "customer"] },
    });

    await fetch(url.href, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok && res.status !== 409) {
          switch (res.status) {
            default:
              showToast(failureMessage);
          }

          setConversation(null);
          return;
        }

        const conversation = (await res.json())?.data?.conversation as
          | TConversation
          | undefined;
        if (!conversation) {
          console.error("conversation is not in the expected format");
          showToast(failureMessage);
          return;
        }

        setConversation(conversation);
        setIsOpen(true);
      })
      .catch((err) => {
        console.error("failed to fetch conversation", err);
        showToast(failureMessage);
      });
  }

  return { startConversation };
}
