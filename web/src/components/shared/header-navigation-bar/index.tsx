"use client";

import { Link } from "@/lib/i18n/navigation";
import ZoozLogo from "../zooz-logo";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useScroll } from "@/lib/hooks";
import ZoozImage from "../zooz-image";
import Button from "../button";

export default function HeaderNavigationBar() {
  const navigationSampleItems = ["Buy", "Sell", "Services"];
  const t = useTranslations("header-navigation-bar");

  const { isScrollingDown } = useScroll();

  // TODO: responsive mobile navigation burger menu
  return (
    <header
      className={cn("sticky top-0 bg-primary-1/70 backdrop-blur-sm z-10", {
        "animate-slide-in-bottom": !isScrollingDown,
        "animate-slide-out-top": isScrollingDown,
      })}
    >
      <nav className="px-l-xl py-2xs-xs border-b-[0.5px] border-gray-300 flex items-center">
        <ZoozLogo />

        <ul className="ms-auto flex items-center gap-2xs-xs">
          {navigationSampleItems.map((item, index) => (
            <li key={index}>
              <Link
                href="/"
                className={cn(
                  "text-lg transition-all hover:text-on-primary-1 outline-none focus:text-on-primary-1",
                  {
                    "text-gray-500": true,
                    "text-on-primary-1 font-medium": false,
                  },
                )}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        <section className="flex items-center ms-s-m gap-xs-s">
          <Button>List your home</Button>
          <div className="h-l-xl w-l-xl rounded-full relative overflow-hidden">
            <ZoozImage
              src="https://images.unsplash.com/photo-1709588191280-acd9303db2cc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={t("avatar")}
              title={t("avatar")}
              fill
              sizes="(min-width: 1320px) 38px, calc(1.7vw + 16px)"
              quality={65}
            />
          </div>
        </section>
      </nav>
    </header>
  );
}
