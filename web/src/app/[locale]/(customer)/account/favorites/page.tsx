import Card from "@/components/customer/listings/card";
import { IBasePageParams, TListing } from "@types";
import { cn } from "@/lib/utils";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { getAccessToken } from "@/lib/actions/auth";
import { fetchApi } from "@/lib/api";

export default async function Favorites({
  params: { locale },
}: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("customer.account-favorites");

  const accessToken = await getAccessToken();
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetchApi("/listings/favorites", { init: { headers } });
  if (!res.ok) {
    console.error("account.favorites: ", res.statusText);
    return <></>;
  }
  const listings = (await res.json())?.data?.listings as TListing[] | undefined;
  if (!listings?.length) {
    console.error("account.favorites: listings are empty");
    return <></>;
  }

  // TODO: customer favorites tab filter
  const sampleFilters: string[] = [
    // "All", "Property", "Agencies"
  ];

  return (
    <main className="my-2xl-3xl">
      <section className="mx-auto max-w-page px-page">
        <article>
          <h2 className="text-3xl font-semibold">{t("your-favorites")}</h2>

          <search className="mb-s-m mt-l-xl border-b">
            <ul className="flex items-center gap-s-m">
              {sampleFilters.map((filter, index) => (
                <li key={index}>
                  <button
                    className={cn(
                      "pb-s-m text-xl font-bold outline-none transition-all focus:translate-y-[-0.25rem]",
                      {
                        "font-medium text-gray-500 hover:text-on-primary-1 focus:text-on-primary-1":
                          index !== 0, // in case of inactive
                      },
                      {
                        "border-b-[4px] border-accent-1": index === 0,
                      },
                    )}
                  >
                    {filter}
                  </button>
                </li>
              ))}
            </ul>
          </search>
        </article>

        <section>
          <ul className="space-y-m-l">
            {listings.map((listing, index) => (
              <li key={index}>
                <Card listing={listing} />
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
