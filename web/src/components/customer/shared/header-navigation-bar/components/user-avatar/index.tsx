"use client";

import ZoozImage from "@/components/shared/zooz-image";
import ZoozieDropDown from "@/components/shared/zoozie-dropdown";
import { signOut } from "@/lib/actions/auth";
import { useUser } from "@/lib/context/user";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { cn, getUserImage } from "@/lib/utils";
import {
  faHeart,
  faRightToBracket,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./components/language-switcher";

export default function UserAvatar() {
  const t = useTranslations("customer.header-navigation-bar");
  const router = useRouter();
  const { user, refresh: refreshUser } = useUser();

  return (
    <ZoozieDropDown
      buttonClassName="px-0 focus:bg-primary-1 bg-transparent"
      title={
        <div
          className={cn(
            "relative h-l-xl w-l-xl overflow-hidden rounded-full bg-gray-300 transition-all",
            {
              "animate-pulse duration-200": user?.pending,
            },
            {
              "ring-2 ring-accent-1 hover:ring-focused-accent-1": user?.value,
            },
          )}
        >
          {!user?.pending && (
            <ZoozImage
              src={getUserImage(user?.value)}
              alt={t("avatar")}
              title={t("avatar")}
              fill
              sizes="(min-width: 1320px) 38px, calc(1.7vw + 16px)"
              quality={65}
              className="object-cover"
            />
          )}
        </div>
      }
    >
      {user?.value?.role === "CUSTOMER" && (
        <>
          <Link
            href="/account/favorites"
            className="!flex items-center gap-2xs-xs"
          >
            <FontAwesomeIcon icon={faHeart} />
            {t("favorites")}
          </Link>
          <LanguageSwitcher />
          <button
            className="!flex w-full items-center gap-2xs-xs border-t outline-none"
            onClick={async function handleSignOut() {
              await signOut();
              refreshUser();
            }}
          >
            <FontAwesomeIcon
              icon={faRightToBracket}
              className="rtl:scale-x-[-1]"
            />
            {t("sign-out")}
          </button>
        </>
      )}

      {user?.value?.role === "AGENCY_AGENT" && (
        <>
          {user?.value?.agent?.agency?.slug && (
            <Link
              href={`/${user?.value?.agent?.agency?.slug}`}
              className="!flex items-center gap-2xs-xs"
            >
              <FontAwesomeIcon icon={faToolbox} />
              {t("dashboard")}
            </Link>
          )}
          <LanguageSwitcher />
          <button
            className="!flex w-full items-center gap-2xs-xs border-t outline-none"
            onClick={async function handleSignOut() {
              await signOut();
              refreshUser();
              router.push("/auth/register");
            }}
          >
            <FontAwesomeIcon
              icon={faRightToBracket}
              className="rtl:scale-x-[-1]"
            />
            {t("sign-out")}
          </button>
        </>
      )}

      {!user?.value?.role && (
        <>
          <LanguageSwitcher />
          <Link href="/auth/login" className="!flex items-center gap-2xs-xs">
            <FontAwesomeIcon
              icon={faRightToBracket}
              className="rtl:scale-x-[-1]"
            />
            {t("sign-in")}
          </Link>
        </>
      )}
    </ZoozieDropDown>
  );
}
