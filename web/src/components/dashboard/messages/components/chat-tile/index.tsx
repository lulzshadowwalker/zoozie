import ZoozImage from "@/components/shared/zooz-image";
import { Locale } from "@/lib/i18n/config";
import { TConversation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import { HTMLAttributes } from "react";

interface ChatTileProps extends HTMLAttributes<HTMLElement> {
  active?: boolean;
  conversation: TConversation;
}

export async function ChatTile({
  active,
  conversation,
  className,
  ...rest
}: ChatTileProps) {
  const t = await getTranslations("dashboard.messages");
  const locale = (await getLocale()) as Locale;
  const customer = conversation.customer;

  console.table(conversation?.messages);

  return (
    <div
      className={cn(
        "flex cursor-pointer items-start gap-xs-s rounded-2xl p-s-m transition-all hover:bg-gray-100",
        className,
        {
          "cursor-default bg-gray-100": active,
        },
      )}
      {...rest}
    >
      <div className="relative min-h-xl-2xl w-full max-w-xl-2xl overflow-hidden rounded-full bg-gray-400">
        <ZoozImage
          src={customer?.profilePicture ?? ""}
          // TODO: add customer name to alt text
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
              {new Date(conversation?.createdAt).toLocaleDateString(
                locale === "ar" ? "ar-JO" : "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              )}
            </time>
          )}
        </div>
        <p className="line-clamp-2 text-lg font-light leading-[2.4rem] text-gray-500">
          {conversation?.latestMessage?.content ?? t("nothing-here-yet")}
        </p>
      </div>
    </div>
  );
}

interface ChatTileSkeletonProps extends HTMLAttributes<HTMLElement> {}

export async function ChatTileSkeleton({
  className,
  ...rest
}: ChatTileSkeletonProps) {
  return (
    <div
      className={cn("flex items-start gap-xs-s rounded-2xl p-s-m", className)}
      {...rest}
    >
      <div className="relative min-h-xl-2xl w-full max-w-xl-2xl animate-pulse overflow-hidden rounded-full bg-gray-200"></div>

      <div className="flex-grow">
        <div className="h-s-m w-full max-w-[15rem] animate-pulse rounded-sm bg-gray-200"></div>

        <div className="mb-3xs-2xs mt-2xs-xs h-xs-s w-full animate-pulse rounded-sm bg-gray-200"></div>
        <div className="h-xs-s w-full animate-pulse rounded-sm bg-gray-200"></div>
      </div>
    </div>
  );
}
