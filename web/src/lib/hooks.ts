import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { showToast } from "./utils";
import { TZoozieUserMessage } from "./types";
import { useParams } from "next/navigation";
import { Locale } from "./i18n/config";
import { usePathname } from "./i18n/navigation";
import Config from "./config";
import path from "path";

/**
 * Hook that tracks the scroll position and direction.
 *
 * Returns an object with a boolean indicating if the page is
 * scrolling down, and a number with the scroll offset.
 */
export function useScroll() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;

    setScrollOffset(y);
    if (y < 25) {
      setIsScrollingDown(false);
      return;
    }

    setIsScrollingDown(y > scrollOffset);
  }, [scrollOffset]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return { isScrollingDown };
}

export function useToastHelpers() {
  const t = useTranslations("toast-helpers");

  function showAuthRequiredToast() {
    const message: TZoozieUserMessage = {
      status: "info",
      message: t("auth-required"),
    };

    showToast(message);
  }

  /**
   * Displays a toast notification indicating that agents cannot
   * interact with certain customer functionalities.
   *
   * This function is intended to inform the user (an agent)
   * that their current permissions do not allow interaction with
   * specific customer-related features or actions.
   */
  function showAgentRestrictionToast() {
    const message: TZoozieUserMessage = {
      status: "info",
      message: t("agents-cannot-interact-with-customer-functionalities"),
    };

    showToast(message);
  }

  return { showAuthRequiredToast, showAgentRestrictionToast };
}

export function useFormatDateTime() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as Locale;

  // FIXME: `formatDateTime` does not accurately calculate the difference between the datetimes from the API and the current local time
  function formatDateTime(v: string | Date | number): string {
    const now = new Date();
    const dateTime = new Date(v);
    const difference = now.getTime() - dateTime.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (difference <= minute) {
      return t("just-now");
    } else if (difference <= hour) {
      const minutesAgo = Math.floor(difference / (60 * 1000));
      return `${minutesAgo} ${t("minutes-ago")}`;
    } else if (difference <= day) {
      return dateTime.toLocaleTimeString(locale === "ar" ? "ar-JO" : "en-US", {
        hour: "numeric",
        minute: "numeric",
      });
    } else {
      return dateTime.toLocaleDateString(locale === "ar" ? "ar-JO" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  return { formatDateTime };
}

/**
 * Returns the current full URL (without the query string).
 *
 * @return {Object} An object containing the current URL.
 * @property {string} url - The current URL.
 */
export function useCurrentUrl() {
  const pathname = usePathname();
  const baseUrl = Config.baseUrl;
  const url = new URL(path.join(baseUrl, pathname)).href;

  return { url };
}
