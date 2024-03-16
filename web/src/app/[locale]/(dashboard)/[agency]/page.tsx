import Header from "@/components/dashboard/shared/header";
import Button from "@/components/shared/button";
import ZoozImage from "@/components/shared/zooz-image";
import { IBasePageParams } from "@/lib/types/types";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function Home({ params: { locale } }: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("dashboard.home");

  return (
    <Header
      leading={
        <div className="flex items-center gap-s-m">
          <div className="h-[3.2rem] w-[3.2rem] rounded-full overflow-hidden relative">
            <ZoozImage
              src="https://images.unsplash.com/photo-1512646605205-78422b7c7896?q=80&w=2025&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              title={t("user-avatar")}
              alt={t("user-avatar")}
              fill
              sizes="42px"
              className="object-cover"
            />
          </div>

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
