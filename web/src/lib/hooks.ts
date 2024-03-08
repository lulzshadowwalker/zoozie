import { useState, useEffect, useCallback } from "react";

export function useScroll(
  { threshold }: { threshold?: number } = { threshold: 0 },
) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;

    setIsScrollingDown(y > scrollOffset);
    setScrollOffset(y);
  }, [scrollOffset]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return { isScrollingDown };
}
