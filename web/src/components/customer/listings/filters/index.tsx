"use client";

import { cn } from "@/lib/utils";
import {
  faBuilding,
  faHotel,
  faHouse,
  faTreeCity,
  faWheatAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FilterButton from "./components/filter-button";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";

export default function Filters() {
  const t = useTranslations("customer.listings");
  const searchParams = useSearchParams();
  const router = useRouter();

  const propertyTypes = [
    {
      title: t("apartment"),
      icon: faBuilding,
      value: "APARTMENT",
    },
    {
      title: t("villa"),
      icon: faHouse,
      value: "VILLA",
    },
    {
      title: t("condominium"),
      icon: faHotel,
      value: "CONDOMINIUM",
    },
  ] as const;

  function updateUrl(value: string) {
    if (!value) return;
    const q = new URLSearchParams(searchParams);
    q.set("type", value);

    router.replace(`?${q.toString()}`);
  }

  return (
    <section className="mx-auto max-w-page px-page">
      <nav className="flex items-center justify-between gap-m-l">
        <ul className="flex flex-grow items-center gap-m-l overflow-scroll">
          {propertyTypes.map(({ title, value, icon }, index) => {
            const active = searchParams.get("type") === value;

            return (
              // TODO: focus, focus-within
              <li
                className={cn(
                  "group flex w-full min-w-fit max-w-[10rem] cursor-pointer flex-col items-center gap-2xs-xs pb-2xs-xs",
                  {
                    "pointer-events-none border-b-[3px] border-on-primary-1":
                      active,
                  },
                )}
                key={index}
                onClick={() => updateUrl(value)}
              >
                <FontAwesomeIcon
                  icon={icon}
                  size="lg"
                  className={cn(
                    "text-gray-300 transition-all group-hover:text-on-primary-1",
                    {
                      "text-on-primary-1": active,
                    },
                  )}
                />
                <p
                  className={cn(
                    "font-medium text-gray-300 transition-all group-hover:text-on-primary-1",
                    {
                      "text-lg text-on-primary-1": active,
                    },
                  )}
                >
                  {title}
                </p>
              </li>
            );
          })}
        </ul>

        <FilterButton />
      </nav>
    </section>
  );
}
