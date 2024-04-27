import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { showToast } from "./utils";
import { ZoozieUserMessage } from "./types";

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
    const message: ZoozieUserMessage = {
      status: "info",
      message: t("auth-required"),
    };

    showToast(message);
  }

  return { showAuthRequiredToast };
}
