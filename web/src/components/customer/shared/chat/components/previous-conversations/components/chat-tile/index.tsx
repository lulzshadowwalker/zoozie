"use client";

import ZoozImage from "@/components/shared/zooz-image";
import { generateApiUrl } from "@/lib/api";
import { useUser } from "@/lib/context/user";
import { useFormatDateTime } from "@/lib/hooks";
import { Locale } from "@/lib/i18n/config";
import {
  useCustomerMessagesStore,
  useCustomerStartConversation,
} from "@/lib/store/customer-messages";
import { TConversation, TZoozieUserMessage } from "@/lib/types";
import { cn, getAgencyImage, getCustomerImage, showToast } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { HTMLAttributes } from "react";

interface ChatTileProps extends HTMLAttributes<HTMLElement> {
  conversation: TConversation;
}

export function ChatTile({ conversation, className, ...rest }: ChatTileProps) {
  const t = useTranslations("customer.messages");
  const agency = conversation.agency;
  const latestMessage = conversation.latestMessage;
  const { startConversation } = useCustomerStartConversation();
  const { formatDateTime } = useFormatDateTime();

  function handleStartConversation() {
    if (!conversation?.agencyId) {
      console.error("ChatTile: conversation agency id cannot be empty");
      return;
    }

    startConversation(conversation.agencyId);
  }

  return (
    <button
      onClick={handleStartConversation}
      // href={`?customer=${conversation?.customer?.customer?.id}`}
      className={cn(
        "flex w-full cursor-pointer items-start gap-xs-s rounded-2xl p-s-m transition-all hover:bg-gray-100 focus:bg-gray-100 focus:no-underline",
        className,
      )}
      {...rest}
    >
      <div className="relative min-h-xl-2xl w-full max-w-xl-2xl overflow-hidden rounded-full bg-gray-400">
        <ZoozImage
          src={getAgencyImage(agency?.logo)}
          alt={`${agency?.name ?? ""} ${t("logo")}`}
          title={`${agency?.name ?? ""} ${t("logo")}`}
          fill
          sizes="(min-width: 1320px) 38px, calc(1.7vw + 16px)"
          quality={65}
          className="object-cover"
        />
      </div>

      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {agency?.name ?? t("unknown-agency")}
          </h2>

          {latestMessage?.sentAt && (
            <time
              dateTime={latestMessage?.sentAt}
              className="text-base font-light text-gray-500"
            >
              {formatDateTime(latestMessage?.sentAt)}
            </time>
          )}
        </div>
        <p className="line-clamp-2 text-start text-lg font-light leading-[2.4rem] text-gray-500">
          {conversation?.latestMessage?.content ?? t("nothing-here-yet")}
        </p>
      </div>
    </button>
  );
}
