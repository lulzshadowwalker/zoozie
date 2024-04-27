import { IBasePageParams, TListing } from "@types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import ListingsComponent from "@/components/customer/shared/listings";
import Filters from "@/components/customer/listings/filters";
import Search from "@/components/customer/listings/search";
import { fetchApi } from "@/lib/api";
import { useUser } from "@/lib/context/user-context";
import { getAccessToken } from "@/lib/actions/auth";

export default async function Listings({
  params: { locale },
}: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("listings");

  const accessToken = await getAccessToken();
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetchApi("/listings", {
    init: { headers },
  });
  if (!res.ok) {
    console.error("listings: ", res.statusText);
    return <></>;
  }

  const listings = (await res.json())?.data?.listings as TListing[] | undefined;
  if (!listings?.length) {
    console.error("listings: listings are empty");
    return <></>;
  }

  return (
    <main className="my-2xl-3xl">
      <Search />
      <Filters />
      <section className="mx-auto my-l-xl max-w-page px-page">
        <ListingsComponent listings={listings} />
      </section>
    </main>
  );
}
