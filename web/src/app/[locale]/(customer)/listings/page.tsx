import { IBasePageParams, TListing } from "@types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import ListingsComponent from "@/components/customer/shared/listings";
import Filters from "@/components/customer/listings/filters";
import Search from "@/components/customer/listings/search";
import { fetchApi } from "@/lib/api";
import { getAccessToken } from "@/lib/actions/auth";
import {
  extractListingsFiltersFromSearchParams,
  pageSearchParamsToURLSearchParams,
} from "@/lib/utils";
import EmptyState from "@/components/customer/listings/empty-state";

export default async function Listings({
  params: { locale },
  searchParams,
}: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("customer.listings");

  const accessToken = await getAccessToken();
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const filters = extractListingsFiltersFromSearchParams(
    pageSearchParamsToURLSearchParams(searchParams),
  );

  const res = await fetchApi("/listings", {
    init: { headers },
    queryParams: filters as Record<string, string>,
  });
  if (!res.ok) {
    throw new Error("listings: " + res.statusText);
  }

  const listings = (await res.json())?.data?.listings as TListing[] | undefined;
  if (!listings) {
    throw new Error(
      "listings: listings response is not in the expected format",
    );
  }

  const empty = !listings.length;

  return (
    <main className="my-2xl-3xl">
      <Search />
      <Filters />
      <section className="mx-auto my-l-xl max-w-page px-page max-sm:px-l-xl">
        {empty ? <EmptyState /> : <ListingsComponent listings={listings} />}
      </section>
    </main>
  );
}
