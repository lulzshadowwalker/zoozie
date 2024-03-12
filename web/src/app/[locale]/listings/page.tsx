import Button from "@/components/shared/button";
import { IBasePageParams } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import {
  faArrowRight,
  faMagnifyingGlass,
  faWheatAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import ListingsComponent from "@components/shared/listings";
import Filters from "@/components/listings/filters";
import Search from "@/components/listings/search";

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
