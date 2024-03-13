import { cn } from "@/lib/utils";
import { faWheatAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FilterButton from "./components/filter-button";

export default function Filters() {
  return (
    <section className="max-w-page mx-auto px-page">
      <nav className="flex justify-between items-center gap-m-l">
        <ul className="flex items-center gap-m-l overflow-scroll">
          {[...Array(20)].map((_, index) => (
            // TODO: focus, focus-within
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

        <FilterButton />
      </nav>
    </section>
  );
}
