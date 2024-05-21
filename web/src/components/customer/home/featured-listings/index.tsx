import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@/lib/i18n/navigation";
import Listings from "@/components/customer/shared/listings";
import { getTranslations } from "next-intl/server";
import { fetchApi } from "@/lib/api";
import { TListing } from "@/lib/types";
import { getAccessToken } from "@/lib/actions/auth";

export default async function FeaturedListings() {
  const accessToken = await getAccessToken();
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const t = await getTranslations("customer.home");
  const res = await fetchApi("/listings", { init: { headers } });
  if (!res.ok) {
    console.error("utils.FeaturedListings: ", res.statusText);
    return <></>;
  }
  const listings = (await res.json())?.data?.listings as TListing[] | undefined;
  if (!listings?.length) {
    console.error("utils.FeaturedListings: listings are empty");
    return <></>;
  }

  return (
    <section className="mx-auto my-l-xl max-w-page px-page max-sm:px-l-xl">
      <article>
        <h2 className="text-2xl font-semibold">{t("featured-listings")}</h2>
        <Listings listings={listings?.slice(0, 8)} />

        <Link
          href="/listings"
          className="mt-xs-s inline-block w-full text-end underline underline-offset-4 outline-none hover:decoration-transparent focus:decoration-transparent"
        >
          {t("view-more")}{" "}
          <FontAwesomeIcon icon={faArrowRight} className="rtl:rotate-180" />
        </Link>
      </article>
    </section>
  );
}
