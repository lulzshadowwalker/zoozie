import Header from "@/components/dashboard/home/header";
import { IBaseAgencyParams } from "@types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "@/lib/i18n/navigation";
import { authenticate, forbidden, Forbidden, TokenNotFound } from "@/lib/auth";
import { cookies } from "next/headers";
import { getUser } from "@/lib/actions/auth";
import CardStats from "@/components/dashboard/home/card-stats";
import PageViewsChart from "@/components/dashboard/home/charts/page-views";

export default async function Home({
  params: { locale, agency },
}: IBaseAgencyParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("dashboard.home");
  const res = await getUser();
  const user = res?.user;

  try {
    const claims = await authenticate(cookies().get("access-token")?.value);
    if (claims.agencySlug !== agency) forbidden();
  } catch (e) {
    if (e instanceof Forbidden) redirect("/403");
    if (e instanceof TokenNotFound) redirect("/auth/register");
    throw e;
  }

  return (
    <>
      <Header />
      <main className="mx-m-l">
        <CardStats />

        <section className="my-m-l grid grid-cols-1 gap-xs-s lg:grid-cols-2">
          <PageViewsChart className="lg:col-span-2" agency={agency} />
        </section>
      </main>
    </>
  );
}
