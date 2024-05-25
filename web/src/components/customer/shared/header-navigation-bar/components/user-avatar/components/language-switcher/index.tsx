"use client";

import { Locale } from "@/lib/i18n/config";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { faEarthAsia } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocale, useTranslations } from "next-intl";

export default function LanguageSwitcher() {
  const t = useTranslations("customer.header-navigation-bar");
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <Link
      href={pathname}
      locale={locale === "en" ? "ar" : "en"}
      className="!flex items-center gap-2xs-xs"
    >
      <FontAwesomeIcon icon={faEarthAsia}></FontAwesomeIcon>
      {locale === "en" ? t("arabic") : t("english")}
    </Link>
  );
}
