import { IBasePageParams } from "@types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import ListingsComponent from "@/components/customer/shared/listings";
import Filters from "@/components/customer/listings/filters";
import Search from "@/components/customer/listings/search";

export default async function Listings({
  params: { locale },
}: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("listings");

  return (
    <main className="my-2xl-3xl">
      <Search />
      <Filters />
      <section className="max-w-page mx-auto px-page my-l-xl">
        <ListingsComponent />
      </section>
    </main>
  );
}
