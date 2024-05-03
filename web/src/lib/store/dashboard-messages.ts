import { create } from "zustand";
import { TConversation } from "../types";

type TState = {
    conversation: TConversation | null;
};

type TActions = {
    setConversation(conversation: TConversation | null): void
};

export const useDashboardMessagesStore = create<TState & TActions>(
    (set) => ({
        conversation: null,
        setConversation: (conversation) => set({ conversation }),
    })
)