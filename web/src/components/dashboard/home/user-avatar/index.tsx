"use client";

import ZoozImage from "@/components/shared/zooz-image";
import { useUser } from "@/lib/context/user-context";
import { useTranslations } from "next-intl";

export default function UserAvatar() {
  const t = useTranslations("dashboard.home");
  const { user } = useUser();

  return (
    <div className="h-[3.2rem] w-[3.2rem] rounded-full overflow-hidden relative bg-gray-400">
      {
        user?.profilePicture &&
        <ZoozImage
          src={user.profilePicture}
          title={t("user-avatar")}
          alt={t("user-avatar")}
          fill
          sizes="42px"
          className="object-cover"
        />
      }
    </div>
  )
}
