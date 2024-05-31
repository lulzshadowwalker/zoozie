import Header from "@/components/dashboard/home/header";
import { IBaseAgencyParams, TAgency } from "@types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "@/lib/i18n/navigation";
import { authenticate, forbidden, Forbidden, TokenNotFound } from "@/lib/auth";
import { cookies } from "next/headers";
import { getUser } from "@/lib/actions/auth";
import CardStats from "@/components/dashboard/home/card-stats";
import PageViewsChart from "@/components/dashboard/home/charts/page-views";
import { fetchApi } from "@/lib/api";
import { notFound } from "next/navigation";
import RatingsChart from "@/components/dashboard/home/charts/ratings";

export default async function Home({
  params: { locale, agency: slug },
}: IBaseAgencyParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("dashboard.home");
  const userResponse = await getUser();
  const user = userResponse?.user;

  try {
    const claims = await authenticate(cookies().get("access-token")?.value);
    if (claims.agencySlug !== slug) forbidden();
  } catch (e) {
    if (e instanceof Forbidden) redirect("/403");
    if (e instanceof TokenNotFound) redirect("/auth/register");
    throw e;
  }

  const res = await fetchApi("/agencies", {
    queryParams: { slug },
  });
  if (!res.ok) {
    if (res.status === 404) notFound();

    throw new Error("failed to fetch agency because " + res.statusText);
  }

  const agency = (await res.json())?.data?.agency as TAgency | undefined;
  if (!agency) {
    throw new Error("agency is not in the expected format");
  }

  return (
    <>
      <Header />
      <main className="mx-m-l">
        <CardStats />

        <section className="my-m-l grid grid-cols-1 gap-xs-s lg:grid-cols-2">
          <PageViewsChart className="lg:col-span-2" agency={agency} />
          <RatingsChart className="grid-cols-1" agency={agency} />
        </section>
      </main>
    </>
  );
}
