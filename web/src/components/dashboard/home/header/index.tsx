import UserAvatar from "@/components/customer/shared/header-navigation-bar/components/user-avatar";
import DashboardHeader from "../../shared/header";
import Button from "@/components/shared/button";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { getUser } from "@/lib/actions/auth";
import { getTranslations } from "next-intl/server";

export default async function Header() {
  const t = await getTranslations("dashboard.home");
  const user = await getUser().then((res) => res?.user);

  return (
    <DashboardHeader
      leading={
        <div className="flex items-center gap-s-m">
          <UserAvatar />
          {user?.name && (
            <h2 className="text-2xl">
              {t("welcome-back")}, {user.name}.
            </h2>
          )}
        </div>
      }
      trailing={
        <Button
          square
          className="flex h-[3.8rem] w-[3.8rem] items-center justify-center rounded-full"
          typ="secondary"
        >
          <FontAwesomeIcon icon={faBell} size="lg" />
        </Button>
      }
    />
  );
}
