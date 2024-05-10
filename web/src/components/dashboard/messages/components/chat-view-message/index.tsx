import ZoozImage from "@/components/shared/zooz-image";
import { TAgency, TConversationMessage, TCustomer } from "@/lib/types";
import { cn, getAgencyImage, getCustomerImage } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type ChatViewMessageProps = {
  agency: TAgency;
  customer: TCustomer;
  message: TConversationMessage;
};

export function ChatViewMessage({ message, agency, customer }: ChatViewMessageProps) {
  const t = useTranslations("dashboard.messages");
  const sender = message.sender === "AGENCY";
  const receiver = !sender;

  if (message.type !== "TEXT") {
    console.error("ChatViewMessage: unsupported message type:", message.type);
    return <></>
  }

  return (
    <div
      className={cn("flex max-w-[55rem] items-start gap-s-m", {
        "ms-auto flex-row-reverse": sender,
      })}
    >
      <div className="relative min-w-[5rem] min-h-[5rem] h-[5rem] w-[5rem] overflow-hidden rounded-full bg-gray-400">
        <ZoozImage
          src={sender ? getAgencyImage(agency.logo) : getCustomerImage(customer.profilePicture)}
          alt={`${(sender ? agency.name : customer.name) ?? ''} ${t("avatar")}`}
          title={`${(sender ? agency.name : customer.name) ?? ''} ${t("avatar")}`}
          fill
          sizes="(min-width: 1320px) 38px, calc(1.7vw + 16px)"
          quality={65}
          className="object-cover"
        />
      </div>

      <p
        className={cn(
          "rounded-3xl bg-primary-1/50 p-xs-s break-words",
          {
            "rounded-tr-none": sender,
          },
          {
            "rounded-tl-none bg-primary-1/50": receiver,
          },
        )}
      >
        {message?.content}
      </p>
    </div>
  );
}
