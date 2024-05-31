"use client";

import ZoozImage from "@/components/shared/zooz-image";
import { generateApiUrl } from "@/lib/api";
import { useUser } from "@/lib/context/user";
import { useFormatDateTime } from "@/lib/hooks";
import { Locale } from "@/lib/i18n/config";
import { Link } from "@/lib/i18n/navigation";
import { useDashboardMessagesStore } from "@/lib/store/dashboard-messages";
import { TConversation, TZoozieUserMessage } from "@/lib/types";
import { cn, getCustomerImage, showToast } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { HTMLAttributes, useEffect } from "react";

interface ChatTileProps extends HTMLAttributes<HTMLElement> {
  conversation: TConversation;
}

export function ChatTile({ conversation, className, ...rest }: ChatTileProps) {
  const t = useTranslations("dashboard.messages");
  const { locale } = useParams();
  const searchParams = useSearchParams();

  const customer = conversation.customer;
  const latestMessage = conversation.latestMessage;

  const active =
    searchParams.get("customer") ===
    // hmm
    conversation?.customer?.customer?.id?.toString();

  const { accessToken } = useUser();

  const customerSearchParam = searchParams.get("customer");
  const { setConversation } = useDashboardMessagesStore();
  const { formatDateTime } = useFormatDateTime();

  useEffect(
    function fetchMessageHistory() {
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

      if (!customerSearchParam) {
        setConversation(null);
        return;
      }

      const customerId = Number(customerSearchParam);
      if (Number.isNaN(customerId)) {
        console.error("ChatViewBody: invalid conversation id");
        showToast({ status: "warning", message: t("dont-do-that") });
        return;
      }

      const url = generateApiUrl({
        endpoint: `/conversations/${customerId}`,
        locale: locale as Locale,
        queryParams: { expand: ["agency", "customer"] },
      });

      fetch(url.href, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        cache: "no-store",
      })
        .then(async (res) => {
          if (!res.ok) {
            switch (res.status) {
              case 403:
                showToast({
                  status: "warning",
                  message: t("not-in-conversation"),
                });
                break;
              case 404:
                showToast({ status: "warning", message: t("dont-do-that") });
                break;
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
            console.error(
              "ChatViewBody: conversation is not in the expected format",
            );
            showToast(failureMessage);
            return;
          }

          setConversation(conversation);
        })
        .catch((err) => {
          console.error("ChatViewBody: failed to fetch conversation", err);
          showToast(failureMessage);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [accessToken.value, customerSearchParam],
  );

  return (
    <Link
      href={`?customer=${conversation?.customer?.customer?.id}`}
      className={cn(
        "flex cursor-pointer items-start gap-xs-s rounded-2xl p-s-m transition-all hover:bg-gray-100 focus:bg-gray-100 focus:no-underline",
        className,
        {
          "cursor-default bg-gray-100": active,
        },
      )}
      {...rest}
    >
      <div className="relative min-h-xl-2xl min-w-xl-2xl  overflow-hidden rounded-full bg-gray-400">
        <ZoozImage
          src={getCustomerImage(customer?.profilePicture)}
          alt={`${customer?.name ?? ""} ${t("avatar")}`}
          title={`${customer?.name ?? ""} ${t("avatar")}`}
          fill
          sizes="(min-width: 1320px) 38px, calc(1.7vw + 16px)"
          quality={65}
          className="object-cover"
        />
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {customer?.name ?? t("unknown-customer")}
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
        <p className="line-clamp-2 text-lg font-light leading-[2.4rem] text-gray-500">
          {conversation?.latestMessage?.content ?? t("nothing-here-yet")}
        </p>
      </div>
    </Link>
  );
}
