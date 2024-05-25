"use client";

import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { cn, showToast } from "@/lib/utils";
import { useScroll } from "@/lib/hooks";
import Button from "@/components/shared/button";
import { useCustomerMessagesStore } from "@/lib/store/customer-messages";
import { generateApiUrl } from "@/lib/api";
import { useUser } from "@/lib/context/user";
import { Locale } from "@/lib/i18n/config";
import { TConversation, TZoozieUserMessage } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname } from "@/lib/i18n/navigation";

export default function ChatFab() {
  const [shouldScaleCount, setShouldScaleCount] = useState(false);
  const { isScrollingDown } = useScroll();
  const isVisible = !isScrollingDown || shouldScaleCount;
  const pathname = usePathname();
  const { isOpen, setIsOpen, previousConversations, setPreviousConversations } =
    useCustomerMessagesStore();

  const count: number = 1;

  const t = useTranslations("customer.messages");
  const { accessToken } = useUser();
  const { locale } = useParams();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken.pending, accessToken.value],
  );

  useEffect(() => {
    setShouldScaleCount(true);
    let timer = setTimeout(() => {
      setShouldScaleCount(false);
    }, 750);
    return () => clearTimeout(timer);
  }, [isOpen]);

  async function fetchConversations(abortController?: AbortController) {
    const unknownErr: TZoozieUserMessage = {
      status: "failure",
      message: t("failed-to-load-previous-messages"),
    };

    try {
      if (accessToken.pending || !accessToken.value) return;

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
          `ChatFab: failed to fetch conversations. status code: ${res.status}`,
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

      setPreviousConversations(conversations);
    } catch (e) {
      if (abortController?.signal.aborted) return;
      console.error(e);
      showToast(unknownErr);
    }
  }

  function open() {
    setIsOpen(true);
  }

  if (isOpen || !previousConversations?.length) return <></>;

  return (
    <Button
      onClick={open}
      className={cn(
        "fixed bottom-m-l right-m-l z-50 flex aspect-square w-[56px] cursor-pointer items-center justify-center rounded-full bg-accent-1 drop-shadow-md transition-all hover:bg-focused-accent-1 dark:drop-shadow-none",
        {
          "scale-0 opacity-40 duration-[600ms]": !isVisible,
          "scale-100 opacity-100 duration-300": isVisible,
          "pointer-events-none opacity-0": count === 0,
        },
        {
          "!bottom-2xl-3xl": pathname.includes("agencies"),
        },
      )}
    >
      <FontAwesomeIcon
        icon={faMessage}
        size="lg"
        className="text-on-primary-1"
      />
    </Button>
  );
}
