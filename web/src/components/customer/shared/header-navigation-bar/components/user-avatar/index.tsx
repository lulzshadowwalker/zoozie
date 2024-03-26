"use client";

import ZoozImage from "@/components/shared/zooz-image";
import { useUser } from "@/lib/context/user-context";
import { useTranslations } from "next-intl";

export default function UserAvatar() {
  const t = useTranslations("customer.header-navigation-bar");
  const { user } = useUser();

  return (
    <div className="h-l-xl w-l-xl rounded-full relative overflow-hidden bg-gray-400">
      {user?.profilePicture &&
        <ZoozImage
          src={user?.profilePicture}
          alt={t("avatar")}
          title={t("avatar")}
          fill
          sizes="(min-width: 1320px) 38px, calc(1.7vw + 16px)"
          quality={65}
          className="object-cover"
        />
      }
    </div>
  )
}
