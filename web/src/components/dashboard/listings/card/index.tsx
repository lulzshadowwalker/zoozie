import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@/lib/i18n/navigation";
import Button from "@components/shared/button";
import ZoozImage from "@components/shared/zooz-image";
import { getTranslations } from "next-intl/server";
import { TListing } from "@/lib/types";

export default async function Card({ listing }: { listing: TListing }) {
  const t = await getTranslations("dashboard.listings");
  const bedrooms = listing.property?.bedrooms?.value;
  const bathrooms = listing.property?.bathrooms?.value;
  const areaSize = listing.property?.area?.value;
  const highlightedPicture =
    listing.pictures?.find((picture) => picture.highlighted) ??
    listing.pictures?.[0];

  const salePrice = listing.availabilities?.find(
    (availability) => availability.availability === "SALE",
  )?.price;
  const rentPrice = listing.availabilities?.find(
    (availability) => availability.availability === "RENT",
  )?.price;

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group flex min-h-[28rem] flex-col gap-m-l rounded-xl border p-m-l shadow-sm !outline-none hover:bg-gray-100/70 md:flex-row dark:shadow-none"
    >
      <section className="flex flex-grow flex-col">
        <p className="text-lg text-gray-400">{listing.type}</p>
        <div className="mb-3xs-2xs">
          {rentPrice && rentPrice?.amount && (
            <div className="flex items-center font-bold text-on-primary-1">
              {rentPrice?.currency && rentPrice?.currency + " "}
              {rentPrice?.amount}

              <span className="ms-2xs-xs inline-block rounded-2xl bg-gray-200 px-2xs-xs py-[0.2rem] text-sm text-on-primary-1">
                {t("rent")}
              </span>
            </div>
          )}
          {salePrice && salePrice?.amount && (
            <div className="font-bold text-on-primary-1">
              {salePrice?.currency && salePrice?.currency + " "}
              {salePrice?.amount}

              <span className="ms-2xs-xs inline-block rounded-2xl bg-gray-200 px-2xs-xs py-[0.2rem] text-sm text-on-primary-1">
                {t("sale")}
              </span>
            </div>
          )}
        </div>
        <p className="text-lg text-gray-400">
          {bedrooms && `${bedrooms} ${t("bedrooms")}, `}
          {bathrooms && `${bathrooms} ${t("bathrooms")}, `}
          {areaSize && `${areaSize}${t("square-meters-unit")}²`}
        </p>

        <Button
          typ="secondary"
          className="mt-auto flex items-center justify-center gap-2xs-xs transition-all md:opacity-0 md:group-hover:opacity-100"
        >
          <FontAwesomeIcon icon={faPen} />
          {t("edit")}
        </Button>
      </section>

      <div className="relative w-full overflow-hidden rounded-lg md:max-w-[30rem]">
        <ZoozImage
          src={highlightedPicture?.url ?? listing.pictures?.[0]?.url ?? ""}
          alt={highlightedPicture?.title ?? listing.pictures?.[0]?.title ?? ""}
          title={
            highlightedPicture?.title ?? listing.pictures?.[0]?.title ?? ""
          }
          fill
          sizes="(min-width: 780px) 300px, calc(90.65vw - 91px)"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
