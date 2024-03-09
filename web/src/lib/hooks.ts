import { useState, useEffect, useCallback } from "react";

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
