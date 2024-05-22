"use client";

import ZoozImage from "@/components/shared/zooz-image";
import { useUser } from "@/lib/context/user";
import { getAgencyImage, getCustomerImage } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function UserAvatar() {
  const t = useTranslations("dashboard.home");
  const { user } = useUser();

  return (
    <div className="relative h-[3.2rem] w-[3.2rem] overflow-hidden rounded-full bg-gray-400">
      <ZoozImage
        src={getCustomerImage(user?.value?.profilePicture)}
        title={t("user-avatar")}
        alt={t("user-avatar")}
        fill
        sizes="42px"
        className="object-cover"
      />
    </div>
  );
}
