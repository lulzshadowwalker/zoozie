"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import ZoozLogo from "../../../shared/zooz-logo";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useScroll } from "@/lib/hooks";
import Button from "../../../shared/button";
import UserAvatar from "./components/user-avatar";
import ZoozieDropDown from "@/components/shared/zoozie-dropdown";

export default function HeaderNavigationBar() {
  const t = useTranslations("customer.header-navigation-bar");
  const pathname = usePathname();

  const navigationSampleItems = [
    {
      title: t("buy"),
      href: "/listings?availability=SALE",
    },
    {
      title: t("rent"),
      href: "/listings?availability=RENT",
    },
  ] as const;

  const { isScrollingDown } = useScroll();

  // TODO: responsive mobile navigation burger menu
  return (
    <header
      className={cn("sticky top-0 z-10 bg-primary-1/70 backdrop-blur-sm", {
        "animate-slide-in-bottom": !isScrollingDown,
        "animate-slide-out-top": isScrollingDown,
      })}
    >
      <nav className="flex items-center border-b-[0.5px] border-gray-300 px-l-xl py-2xs-xs">
        <ZoozLogo />

        <ul className="ms-auto flex items-center gap-2xs-xs">
          {navigationSampleItems.map(({ title, href }, index) => (
            <li key={index}>
              <Link
                href={href ?? pathname}
                className={cn(
                  "text-lg outline-none transition-all hover:text-on-primary-1 focus:text-on-primary-1",
                  {
                    "text-gray-500": true,
                    "font-medium text-on-primary-1": false,
                  },
                  {
                    "cursor-not-allowed": href === null,
                  },
                )}
              >
                {title}
              </Link>
            </li>
          ))}

          <li>
            <ZoozieDropDown title="services">
              <div className="cursor-not-allowed">
                <Link
                  href="/services/property-estimation"
                  className="pointer-events-none"
                >
                  Property Estimation
                </Link>
              </div>
            </ZoozieDropDown>
          </li>
        </ul>

        <section className="ms-s-m flex items-center gap-xs-s">
          <Button>List your home</Button>
          <UserAvatar />
        </section>
      </nav>
    </header>
  );
}
