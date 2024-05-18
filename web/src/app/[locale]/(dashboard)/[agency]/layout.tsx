import { fetchApi } from "@/lib/api";
import { IBaseAgencyLayoutParams, IBasePageParams, TAgency } from "@types";
import { unstable_setRequestLocale } from "next-intl/server";

export async function generateStaticParams({
  params: { locale },
}: {
  params: IBasePageParams["params"];
}) {
  const res = await fetchApi("/agencies", { locale });
  if (!res.ok) {
    console.error("failed to fetch agencies because ", res.statusText);
    return [];
  }

  const agencies = (await res.json())?.data?.agencies as TAgency[] | undefined;
  if (!agencies) {
    console.error("agencies are not in the expected format");
    return [];
  }

  return agencies.map((agency) => ({
    agency: agency.slug,
  }));
}

export default async function DashboardAgencyLayout({
  params: { locale },
  children,
}: IBaseAgencyLayoutParams) {
  unstable_setRequestLocale(locale);
  return <>{children}</>;
}
