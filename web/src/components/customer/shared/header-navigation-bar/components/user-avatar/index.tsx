"use client";

import ZoozImage from "@/components/shared/zooz-image";
import ZoozieDropDown from "@/components/shared/zoozie-dropdown";
import { signOut } from "@/lib/actions/auth";
import { useUser } from "@/lib/context/user";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { cn, getCustomerImage, getUserImage, showToast } from "@/lib/utils";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./components/language-switcher";

export default function UserAvatar() {
  const t = useTranslations("customer.header-navigation-bar");
  const { user: res, refresh: refreshUser } = useUser();
  const user = res?.value;

  function showSignOutSuccessToast() {
    showToast({
      status: "success",
      message: t("sign-out-success"),
    });
  }

  return (
    <ZoozieDropDown
      buttonClassName="px-0 focus:bg-primary-1 bg-transparent"
      title={
        <div
          className={cn(
            "relative h-l-xl w-l-xl overflow-hidden rounded-full bg-gray-400",
          )}
        >
          <ZoozImage
            src={getUserImage(user)}
            alt={t("avatar")}
            title={t("avatar")}
            fill
            sizes="(min-width: 1320px) 38px, calc(1.7vw + 16px)"
            quality={65}
            className="object-cover"
          />
        </div>
      }
    >
      {user?.role === "CUSTOMER" && (
        <>
          <Link href="/account/favorites">{t("favorites")}</Link>
          <button
            className="w-full border-t outline-none"
            onClick={async function handleSignOut() {
              await signOut();
              refreshUser();
              showSignOutSuccessToast();
            }}
          >
            {t("sign-out")}
          </button>
        </>
      )}

      {user?.role === "AGENCY_AGENT" && (
        <>
          {user?.agent?.agency?.slug && (
            <Link href={`/${user?.agent?.agency?.slug}`}>{t("dashboard")}</Link>
          )}
          <button
            className="w-full border-t outline-none"
            onClick={async function handleSignOut() {
              await signOut();
              refreshUser();
              showSignOutSuccessToast();
            }}
          >
            {t("sign-out")}
          </button>
        </>
      )}

      {!user?.role && (
        <Link
          href="/auth/login"
          className="!flex items-center justify-between gap-2xs-xs"
        >
          {t("sign-in")}
        </Link>
      )}

      <LanguageSwitcher />
    </ZoozieDropDown>
  );
}
