import Header from "@/components/dashboard/shared/header";
import { IBasePageParams } from "@types";
import { unstable_setRequestLocale } from "next-intl/server";
import Card from "@/components/dashboard/listings/card";
import Button from "@/components/shared/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default async function Listings({
  params: { locale },
}: IBasePageParams) {
  unstable_setRequestLocale(locale);

  return (
    <main>
      <Header leading={<h1 className="text-2xl">Listings</h1>} />

      <section className="flex gap-m-l my-l-xl mx-s-m">
        <article className="flex-grow-[1.2] basis-0">
          <Filters />

          <ul className="space-y-s-m my-s-m">
            {[...Array(30)].map((_, index) => (
              <li key={index}>
                <Card />
              </li>
            ))}
          </ul>
        </article>



        <iframe
          src="https://widgets.scribblemaps.com/sm/?d&dv&cv&z&l&gc&af&mc&lat=31.98770722&lng=35.83656691&vz=14&type=custom_style&ti&s&width=550&height=400&id=Fj4JzBDCcz"
          allow="geolocation"
          loading="lazy"
          className="flex-grow basis-0 rounded-xl sticky top-[1.2rem] self-stretch max-lg:hidden h-[95dvh]"
        />
        <AddFab />
      </section>
    </main>
  );
}

function Filters() {
  return (
    <search className="flex items-center justify-between gap-m-l">
      <div className="flex-grow p-xs-s flex items-center focus-within:border-b-2">
        <label htmlFor="search-field">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="xl"
            className="text-gray-300"
          />
        </label>

        <input
          id="search-field"
          type="search"
          placeholder="Search by address, city, or ZIP"
          className="bg-transparent w-full mx-2xs-xs outline-none"
        />
      </div>

      <Button
        typ="secondary"
        className="flex items-center gap-2xs-xs text-gray-500"
      >
        <FontAwesomeIcon icon={faFilter} />
        Filter
      </Button>
    </search>
  );
}

function AddFab() {
  return (
    <Button className="fixed bottom-l-xl end-l-xl flex items-center gap-2xs-xs shadow-md dark:shadow-none">
      <FontAwesomeIcon icon={faPlus} />
      Add
    </Button>
  );
}
