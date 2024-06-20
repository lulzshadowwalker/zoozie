import Button from "@/components/shared/button";
import ZoozImage from "@/components/shared/zooz-image";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Hero() {
  return (
    <section className="relative mx-auto min-h-[55rem] max-w-page overflow-hidden rounded-xl">
      <ZoozImage
        src="https://images.unsplash.com/photo-1513880989635-6eb491ce7f5b?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        title=""
        fill
        sizes="(min-width: 1280px) 1200px, calc(93.75vw + 19px)"
        className="object-cover"
        priority
        quality={90}
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/50 to-slate-900/0 p-m-l">
        <h2 className="text-3xl font-bold text-gray-200">
          The most beautiful homes
        </h2>
        <p className="text-lg font-light text-gray-200">
          Find the perfect place for you and your family
        </p>

        <search>
          <div className="mt-m-l flex max-w-[42rem] items-center rounded-xl border-focused-accent-1 bg-white p-xs-s transition-all focus-within:border-[3px]">
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
              className="mx-2xs-xs w-full bg-transparent outline-none"
            />

            <label htmlFor="search-field" className="ms-auto">
              <Button>Search</Button>
            </label>
          </div>
        </search>
      </div>
    </section>
  );
}
