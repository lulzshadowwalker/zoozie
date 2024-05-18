import Header from "@/components/dashboard/shared/header";
import Button from "@/components/shared/button";
import { IBaseAgencyParams, IBasePageParams } from "@types";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import UserAvatar from "@/components/dashboard/home/user-avatar";
import { redirect } from "@/lib/i18n/navigation";
import { authenticate, forbidden, Forbidden, TokenNotFound } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function Home({
  params: { locale, agency },
}: IBaseAgencyParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("dashboard.home");
  try {
    const claims = await authenticate(cookies().get("access-token")?.value);
    if (claims.agencySlug !== agency) forbidden();
  } catch (e) {
    if (e instanceof Forbidden) redirect("/403");
    if (e instanceof TokenNotFound) redirect("/auth/register");
    throw e;
  }

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
          className="flex h-[3.8rem] w-[3.8rem] items-center justify-center rounded-full"
          typ="secondary"
        >
          <FontAwesomeIcon icon={faBell} size="lg" />
        </Button>
      }
    />
  );
}
