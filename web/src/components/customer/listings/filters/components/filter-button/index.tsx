"use client";

import Button from "@/components/shared/button";
import ZoozInput from "@/components/shared/zooz-input";
import { generateApiUrl } from "@/lib/api";
import { listingTypes } from "@/lib/const";
import { Locale } from "@/lib/i18n/config";
import { useRouter } from "@/lib/i18n/navigation";
import { TListing, TListingFilters } from "@/lib/types";
import {
  cn,
  extractListingsFiltersFromSearchParams,
  showToast,
} from "@/lib/utils";
import {
  faBuilding,
  faHotel,
  faHouse,
  faTreeCity,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import {
  ReadonlyURLSearchParams,
  useParams,
  useSearchParams,
} from "next/navigation";
import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export default function FilterButton() {
  const t = useTranslations("customer.listings");
  const tCurrency = useTranslations("currency");
  const locale = useParams().locale as Locale;
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [isClosed, setIsClosed] = useState(true);
  const [count, setCount] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const availabilities = [
    { title: t("any"), value: null },
    { title: t("sale"), value: "SALE" },
    { title: t("rent"), value: "RENT" },
  ] as const;
  const [availability, setAvailability] =
    useState<(typeof availabilities)[number]["value"]>(null);

  const bedrooms = [...Array(8)].map((_, index) => ({
    title: index === 0 ? t("any") : (index + 1).toString(),
    value: index === 0 ? null : index + 1,
  }));
  const [minBedrooms, setMinBedroom] =
    useState<(typeof bedrooms)[number]["value"]>(null);

  const bathrooms = bedrooms;
  const [minBathrooms, setMinBathrooms] =
    useState<(typeof bathrooms)[number]["value"]>(null);

  const propertyTypes = [
    {
      title: t("any"),
      icon: faTreeCity,
      value: null,
    },
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
  const [propertyType, setPropertyType] =
    useState<(typeof propertyTypes)[number]["value"]>(null);

  const fetchCount = useCallback(
    async function fetchCount() {
      const queryParams: Record<string, string> = {};
      if (availability) {
        queryParams.availability = availability;

        if (minPrice) {
          if (availability === "RENT") {
            queryParams.minRentPrice = minPrice.toString();
          } else {
            queryParams.minSalePrice = minPrice.toString();
          }
        }

        if (maxPrice) {
          if (availability === "RENT") {
            queryParams.maxRentPrice = maxPrice.toString();
          } else {
            queryParams.maxSalePrice = maxPrice.toString();
          }
        }
      }

      minBedrooms && (queryParams.minBedrooms = minBedrooms.toString());
      minBathrooms && (queryParams.minBathrooms = minBathrooms.toString());
      propertyType && (queryParams.type = propertyType);

      const url = generateApiUrl({
        endpoint: "/listings",
        locale,
        queryParams,
      });
      const res = await fetch(url.href);

      if (!res.ok) {
        showToast({
          status: "failure",
          message: t("something-went-wrong"),
        });
        return;
      }

      const listings = (await res.json())?.data?.listings as
        | TListing[]
        | undefined;

      if (!listings) {
        console.error("listings response is not in the expected format");
        return;
      }

      setCount(listings.length);
    },
    [
      availability,
      minBathrooms,
      minBedrooms,
      locale,
      maxPrice,
      minPrice,
      propertyType,
      t,
    ],
  );

  useEffect(
    function syncSearchParams() {
      const params = extractListingsFiltersFromSearchParams(
        new URLSearchParams(searchParams),
      );
      if (params.availability) {
        setAvailability(availability);
      }

      const minPrice = params.minRentPrice || params.minSalePrice;
      const maxPrice = params.maxRentPrice || params.maxSalePrice;
      minPrice && setMinPrice(minPrice);
      maxPrice && setMaxPrice(maxPrice);

      const minBedrooms = params.minBedrooms;
      if (bedrooms.find((b) => b.value === minBedrooms)) {
        minBedrooms && setMinBedroom(minBedrooms);
      }

      const minBathrooms = params.minBathrooms;
      if (bathrooms.find((b) => b.value === minBathrooms)) {
        minBathrooms && setMinBathrooms(minBathrooms);
      }

      const propertyType = params.type;
      if (propertyType && propertyTypes.find((p) => p.value === propertyType)) {
        setPropertyType(propertyType as any);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams],
  );

  useEffect(() => {
    fetchCount();
  }, [fetchCount, locale, availability, minPrice, maxPrice]);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }

    isClosed ? dialogRef.current.showModal() : dialogRef.current.close();
    setIsClosed((prev) => !prev);
  }

  function submit() {
    const q = new URLSearchParams(searchParams);
    minBathrooms && q.set("minBathrooms", minBathrooms.toString());
    minBedrooms && q.set("minBedrooms", minBedrooms.toString());

    if (availability) {
      q.set("availability", availability);

      if (availability === "RENT") {
        minPrice && q.set("minRentPrice", minPrice.toString());
        maxPrice && q.set("maxRentPrice", maxPrice.toString());

        q.delete("minSalePrice");
        q.delete("maxSalePrice");
      }

      if (availability === "SALE") {
        minPrice && q.set("minSalePrice", minPrice.toString());
        maxPrice && q.set("maxSalePrice", maxPrice.toString());

        q.delete("minRentPrice");
        q.delete("maxRentPrice");
      }
    }

    propertyType && q.set("type", propertyType);
    router.push(`?${q.toString()}`);

    if (!dialogRef.current) {
      console.error("dialogRef.current is not defined");
      return;
    }

    dialogRef.current.close();
  }

  function clear() {
    setCount(null);
    setMinPrice(null);
    setMaxPrice(null);
    setAvailability(null);
    setMinBedroom(null);
    setMinBathrooms(null);
    setPropertyType(null);
  }

  return (
    <>
      <dialog
        ref={dialogRef}
        className={cn("w-full max-w-[65rem] rounded-2xl", {
          "flex flex-col": !isClosed,
        })}
        onClose={(e) => {
          setIsClosed(true);
        }}
      >
        <header className="flex items-center border-b border-gray-200 px-m-l py-s-m">
          <Button
            square
            typ="secondary"
            className="flex min-h-[3.4rem] w-full max-w-[3.4rem] items-center justify-center"
            onClick={toggleDialog}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>

          <h2 className="mx-auto -translate-x-1/2 text-lg font-semibold">
            {t("filters")}
          </h2>
        </header>

        <section className="flex-grow divide-y divide-gray-200 overflow-auto px-m-l [&>*]:py-m-l">
          <DialogSection
            title="Type of Listing"
            subtitle="are you looking to buy or rent a property?"
          >
            <div className="flex items-center">
              {availabilities.map(({ title, value }, index) => {
                const isFirst = index === 0;
                const isLast = index === [...Array(3)].length - 1;

                return (
                  <DialogButton
                    key={index}
                    selected={value === availability}
                    className={cn(
                      "flex-grow rounded-none px-m-l py-l-xl",
                      {
                        "rounded-s-3xl": isFirst,
                        "rounded-e-3xl": isLast,
                      },
                      {
                        "border-e-0 hover:border-e": !isLast,
                      },
                    )}
                    onClick={() => setAvailability(value)}
                  >
                    {title}
                  </DialogButton>
                );
              })}
            </div>
          </DialogSection>

          {availability && (
            <DialogSection
              title={t("price-range.title")}
              subtitle={t("price-range.description")}
            >
              <div className="flex items-center gap-s-m">
                <ZoozInput
                  id="budget-min"
                  label={t("minimum")}
                  type="number"
                  placeholder={`0 ${tCurrency("jod")}`}
                  onChange={({ target: { value } }) =>
                    setMinPrice(Number(value))
                  }
                  value={minPrice ?? undefined}
                />

                <ZoozInput
                  id="budget-max"
                  label={t("maximum")}
                  type="number"
                  placeholder={`0 ${tCurrency("jod")}`}
                  onChange={({ target: { value } }) =>
                    setMaxPrice(Number(value))
                  }
                  value={maxPrice ?? undefined}
                />
              </div>
            </DialogSection>
          )}

          <DialogSection title={t("bedrooms")}>
            <div className="flex items-center gap-xs-s overflow-scroll">
              {bedrooms.map(({ title, value }, index) => (
                <DialogButton
                  selected={value === minBedrooms}
                  key={index}
                  onClick={() => setMinBedroom(value)}
                >
                  {title}
                </DialogButton>
              ))}
            </div>
          </DialogSection>

          <DialogSection title={t("bathrooms")}>
            <div className="flex items-center gap-xs-s overflow-scroll">
              {bathrooms.map(({ title, value }, index) => (
                <DialogButton
                  selected={value === minBathrooms}
                  key={index}
                  onClick={() => setMinBathrooms(value)}
                >
                  {title}
                </DialogButton>
              ))}
            </div>
          </DialogSection>

          <DialogSection title={t("property-type")}>
            <div className="flex items-center gap-s-m">
              {propertyTypes.map(({ title, icon, value }, index) => (
                <DialogButton
                  key={index}
                  className={cn(
                    "flex w-full max-w-[14rem] flex-grow flex-col items-start rounded-2xl px-xs-s",
                    {
                      "border-2 border-on-primary-1 bg-gray-100 text-on-primary-1":
                        value == propertyType,
                    },
                  )}
                  selected={value == propertyType}
                  onClick={() => setPropertyType(value)}
                >
                  <FontAwesomeIcon icon={icon} size="xl" />
                  <h4 className="mt-l-xl font-semibold">{title}</h4>
                </DialogButton>
              ))}
            </div>
          </DialogSection>
        </section>

        <footer className="flex items-center justify-between border-t border-gray-200 px-m-l py-m-l">
          <Button typ="secondary" onClick={clear}>
            {t("clear")}
          </Button>
          <Button
            disabled={!count}
            onClick={submit}
          >{`${t("show")} ${count ?? 0} ${t("places")}`}</Button>
        </footer>
      </dialog>

      <Button typ="secondary" onClick={toggleDialog}>
        {t("filters")}
      </Button>
    </>
  );
}

interface Props extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: string;
  subtitle?: string;
}

function DialogSection({
  title,
  subtitle,
  children,
  className,
  ...rest
}: Props) {
  return (
    <section className={cn(className)} {...rest}>
      <h3 className="text-xl font-medium">{title}</h3>
      {subtitle && (
        <p className="text-lg font-extralight text-gray-400">{subtitle}</p>
      )}
      <div className="my-m-l">{children}</div>
    </section>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

function DialogButton({ className, children, selected, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full border border-gray-300 px-m-l py-2xs-xs outline-none transition-all hover:border-on-primary-1 focus:border-on-primary-1 active:bg-gray-100",
        {
          "bg-on-primary-1 text-primary-1 active:bg-on-primary-1": selected,
        },
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
