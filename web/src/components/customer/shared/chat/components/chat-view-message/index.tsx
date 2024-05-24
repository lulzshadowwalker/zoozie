import { TConversationMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type ChatViewMessageProps = {
  message: TConversationMessage;
};

export function ChatViewMessage({ message }: ChatViewMessageProps) {
  const t = useTranslations("customer.messages");
  const sender = message.sender === "CUSTOMER";
  const receiver = !sender;

  if (message.type !== "TEXT") {
    console.error("ChatViewMessage: unsupported message type:", message.type);
    return <></>;
  }

  return (
    <p
      className={cn(
        "w-fit max-w-[22rem] break-words rounded-3xl bg-accent-1/50 p-xs-s text-[1.4rem]",
        {
          "ml-auto": sender,
        },
        {
          "rounded-tr-none": sender,
        },
        {
          "mr-auto rounded-tl-none bg-gray-200": receiver,
        },
      )}
    >
      {message?.content}
    </p>
  );
}
