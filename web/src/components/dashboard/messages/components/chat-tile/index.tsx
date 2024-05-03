"use client";

import ZoozImage from "@/components/shared/zooz-image";
import { generateApiUrl } from "@/lib/api";
import { useUser } from "@/lib/context/user-context";
import { Locale } from "@/lib/i18n/config";
import { Link } from "@/lib/i18n/navigation";
import { useDashboardMessagesStore } from "@/lib/store/dashboard-messages";
import { TConversation, ZoozieUserMessage } from "@/lib/types";
import { cn, getCustomerImage, showToast } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { HTMLAttributes, useEffect } from "react";

interface ChatTileProps extends HTMLAttributes<HTMLElement> {
  conversation: TConversation;
}

export function ChatTile({
  conversation,
  className,
  ...rest
}: ChatTileProps) {
  const t = useTranslations("dashboard.messages");
  const { locale } = useParams()
  const searchParams = useSearchParams();

  const customer = conversation.customer;
  const active = searchParams.get("conversation") === conversation?.id?.toString();

  const { accessToken } = useUser();

  const conversationSearchParam = searchParams.get("conversation");
  const { setConversation } = useDashboardMessagesStore();

  useEffect(function fetchMessageHistory() {
    if (typeof window === "undefined" || accessToken.pending) return

    const failureMessage: ZoozieUserMessage = { status: "failure", message: t("failed-to-load-message-history") }
    if (!accessToken.value) {
      console.error("ChatViewBody: no access token");
      showToast(failureMessage);
      return
    }

    if (!conversationSearchParam) {
      setConversation(null);
      return;
    }

    const conversationId = Number(conversationSearchParam);
    if (Number.isNaN(conversationId)) {
      console.error("ChatViewBody: invalid conversation id");
      showToast({ status: "warning", message: t("dont-do-that") })
      return
    }

    const url = generateApiUrl({
      endpoint: `/conversations/${conversationId}`,
      locale: locale as Locale,
      queryParams: { expand: ["agency", "customer"] },
    })

    fetch(url.href, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      }
    }).then(async (res) => {
      if (!res.ok) {
        switch (res.status) {
          case 403: showToast({ status: "warning", message: t("not-in-conversation") }); break;
          default: showToast(failureMessage);
        }

        setConversation(null);
        return;
      }

      const conversation = (await res.json())?.data?.conversation as TConversation | undefined;
      if (!conversation) {
        console.error("ChatViewBody: conversation is not in the expected format");
        showToast(failureMessage);
        return;
      }

      setConversation(conversation);
    })
      .catch((err) => {
        console.error("ChatViewBody: failed to fetch conversation", err);
        showToast(failureMessage);
      })
  }, [accessToken, conversationSearchParam, locale, setConversation, t]);


  function formatDate(v: string | Date | number) {
    return new Date(v).toLocaleDateString(
      locale === "ar" ? "ar-JO" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    )
  }

  return (
    <Link
      href={`?conversation=${conversation.id}`}
      className={cn(
        "flex cursor-pointer items-start gap-xs-s rounded-2xl p-s-m transition-all hover:bg-gray-100 focus:no-underline focus:bg-gray-100",
        className,
        {
          "cursor-default bg-gray-100": active,
        },
      )}
      {...rest}
    >
      <div className="relative min-h-xl-2xl w-full max-w-xl-2xl overflow-hidden rounded-full bg-gray-400">
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

      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {customer?.name ?? t("unknown-customer")}
          </h2>

          {conversation?.createdAt && (
            <time
              dateTime={conversation?.createdAt}
              className="text-base font-light text-gray-500"
            >
              {formatDate(conversation?.createdAt)}
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
