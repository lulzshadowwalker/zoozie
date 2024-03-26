import Header from "@/components/dashboard/shared/header";
import Button from "@/components/shared/button";
import { IBasePageParams } from "@types";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import UserAvatar from "@/components/dashboard/home/user-avatar";

export default async function Home({ params: { locale } }: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("dashboard.home");

  return (
    <Header
      leading={
        <div className="flex items-center gap-s-m">
          <UserAvatar />
          <h2 className="text-2xl">Welcome Back, Valeria</h2>
        </div>
      }
      trailing={
        <Button
          square
          className="rounded-full h-[3.8rem] w-[3.8rem] flex items-center justify-center"
          typ="secondary"
        >
          <FontAwesomeIcon icon={faBell} size="lg" />
        </Button>
      }
    />
  );
}
