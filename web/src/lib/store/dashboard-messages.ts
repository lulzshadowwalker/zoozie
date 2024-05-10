import { create } from "zustand";
import { TConversation, TConversationMessage } from "../types";

type TState = {
    conversation: TConversation | null;
};

type TActions = {
    setConversation(conversation: TConversation | null): void
    appendMessage(message: TConversationMessage): void
};

export const useDashboardMessagesStore = create<TState & TActions>(
    (set) => ({
        conversation: null,
        setConversation: (conversation) => set({ conversation }),
        appendMessage: (message) => set((state) => ({
            ...state, conversation: {
                ...state?.conversation,
                latestMessage: message,
                messages: [...(state?.conversation?.messages ?? []), message]
            }
        })),
    })
)