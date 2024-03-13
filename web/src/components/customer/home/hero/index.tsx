import Button from "@/components/shared/button";
import ZoozImage from "@/components/shared/zooz-image";
import { useRouter } from "@/lib/i18n/navigation";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Hero() {
  function handleSearch() {
    // TODO: handle prefetching after validation on hover
    // NOTE: keep this file as a server component to benefit from the blur placeholders that only work on the server with ZoozImage
  }

  return (
    <section className="min-h-[55rem] relative mx-auto max-w-page rounded-xl overflow-hidden">
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

      <div className="absolute p-m-l bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/50 to-slate-900/0">
        <h2 className="text-3xl font-bold text-gray-200">
          The most beautiful homes
        </h2>
        <p className="text-lg text-gray-200 font-light">
          Find the perfect place for you and your family
        </p>

        <search>
          <div className="bg-white p-xs-s rounded-xl flex items-center max-w-[42rem] transition-all focus-within:border-[3px] border-focused-accent-1 mt-m-l">
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

            <label htmlFor="search-field" className="ms-auto">
              <Button>Search</Button>
            </label>
          </div>
        </search>
      </div>
    </section>
  );
}
