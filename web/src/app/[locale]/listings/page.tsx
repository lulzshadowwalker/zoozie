import Button from "@/components/shared/secondary-button";
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

export const dynamic = "force-static";

export default async function Listings({
  params: { locale },
}: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("listings");

  return (
    <main className="my-2xl-3xl">
      <section className="border-b border-gray-300 pb-m-l mb-l-xl">
        <search>
          <div className="mx-auto mt-2xl-3xl p-3xs-2xs rounded-full flex items-center max-w-[64rem] transition-all focus-within:border-[3px] border-focused-accent-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <label htmlFor="search-field">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size="xl"
                className="text-gray-300 ms-2xs-xs"
              />
            </label>

            <input
              id="search-field"
              type="search"

              // TODO: might wanna make the `/listings` search bar have rotating placeholdesr
              // for example, "Search by address, city, or ZIP", "Abdoun with parking", ...etc.
              placeholder="Search by address, city, or ZIP"
              className="bg-transparent w-full mx-2xs-xs outline-none"
            />

            <label htmlFor="search-field" className="ms-auto">
              <Button className="px-xs-s py-xs-s rounded-full">
                <FontAwesomeIcon
                  icon={faArrowRight}
                  size="xl"
                  className="text-[#010400] rtl:rotate-180"
                />
              </Button>
            </label>
          </div>
        </search>
      </section>

      <section className="max-w-page mx-auto px-page">
        <nav className="flex justify-between items-center gap-m-l">
          <ul className="flex items-center gap-m-l overflow-scroll">
            {[...Array(20)].map((_, index) => (
              <li
                className={cn(
                  "flex flex-col items-center gap-2xs-xs pb-2xs-xs min-w-fit group",
                  {
                    "border-b-[3px] border-on-primary-1": index === 0, // in case of being active
                    "cursor-pointer": index !== 0,
                  },
                )}
                key={index}
              >
                <FontAwesomeIcon
                  icon={faWheatAlt}
                  size="lg"
                  className={cn(
                    "text-gray-300 transition-all group-hover:text-on-primary-1",
                    {
                      "text-on-primary-1": index === 0, // in case of being active
                    },
                  )}
                />
                <p
                  className={cn(
                    "text-gray-300 font-medium transition-all group-hover:text-on-primary-1",
                    {
                      "text-on-primary-1 text-lg": index === 0, // in case of being active
                    },
                  )}
                >
                  Farm House
                </p>
              </li>
            ))}
          </ul>

          <Button typ="secondary">{t("filters")}</Button>
        </nav>
      </section>

      <section className="max-w-page mx-auto px-page my-l-xl">
        <ListingsComponent />
      </section>
    </main>
  );
}
