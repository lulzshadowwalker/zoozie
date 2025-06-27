import Button from "@/components/shared/button";
import { faArrowRight, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Search() {
  return (
    <section className="border-b border-gray-300 pb-m-l mb-l-xl">
      <search>
        <div className="mx-auto mt-2xl-3xl p-3xs-2xs rounded-full flex items-center max-w-[64rem] focus-within:ring-[3px] ring-focused-accent-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
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
  )
}
