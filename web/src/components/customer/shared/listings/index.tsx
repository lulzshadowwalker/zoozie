import { Link } from "@/lib/i18n/navigation";
import ZoozImage from "../../../shared/zooz-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCalendarDays,
  faHeart,
  faLocationDot,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { TListing } from "@/lib/types";
import { getTranslations } from "next-intl/server";
import FavoriteButton from "./components/favorite-button";

type Props = {
  listings: TListing[];
};

export default async function Listings({ listings }: Props) {
  const t = await getTranslations("customer.listings");

  return (
    <ul className="mt-s-m grid grid-cols-[repeat(auto-fit,minmax(25.5rem,16rem))] place-content-start gap-3xs-2xs max-[622px]:grid-cols-1 sm:place-content-start">
      {listings?.map((listing, index) => {
        const highlightedPicture =
          listing.pictures?.find((picture) => picture.highlighted) ??
          listing.pictures?.[0];

        const areaName = listing.location?.area?.name;
        const saleAvailability = listing.availabilities?.find(
          (availability) => availability.availability === "SALE",
        );
        const rentAvailability = listing.availabilities?.find(
          (availability) => availability.availability === "RENT",
        );

        const amount =
          saleAvailability?.price?.amount ?? rentAvailability?.price?.amount;
        const currency =
          saleAvailability?.price?.currency ??
          rentAvailability?.price?.currency;

        const bedrooms = listing.property?.bedrooms?.value;
        const yearBuilt = listing.property?.yearBuilt?.value;
        const areaSize = listing.property?.area?.value;

        return (
          <li
            key={index}
            className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl shadow-md dark:shadow-none"
          >
            <Link href={`/listings/${listing.slug}`} className="group">
              <ZoozImage
                src={highlightedPicture?.url ?? ""}
                alt={highlightedPicture?.title ?? ""}
                title={highlightedPicture?.title ?? ""}
                fill
                sizes="(min-width: 640px) 255px, calc(92.81vw - 64px)"
                className="object-cover transition-all duration-[800ms] ease-out hover:scale-105 group-focus:scale-110"
                quality={75}
              />

              <div className="absolute bottom-0 flex min-h-[7rem] w-full flex-col justify-center gap-3xs-2xs bg-primary-1/60 px-s-m py-2xs-xs backdrop-blur-md">
                <div className="flex items-center justify-between">
                  {areaName && (
                    <div className="flex items-center gap-3xs-2xs">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-gray-600"
                      />
                      <span className="text-lg font-semibold">{areaName}</span>
                    </div>
                  )}

                  {amount && currency && (
                    <p className="text-lg">
                      <strong className="inline-block pe-[0.2rem] font-medium">
                        {amount}
                      </strong>
                      <span className="text-base">{currency}</span>
                    </p>
                  )}
                </div>

                <div className="flex justify-start space-x-xs-s">
                  {bedrooms && (
                    <div className="flex items-center gap-3xs-2xs">
                      <FontAwesomeIcon
                        icon={faBed}
                        size="sm"
                        className="text-gray-500"
                      />
                      <span className="text-base font-semibold">
                        {bedrooms}
                      </span>
                    </div>
                  )}

                  {areaSize && (
                    <div className="flex items-center gap-3xs-2xs">
                      <FontAwesomeIcon
                        icon={faUpRightAndDownLeftFromCenter}
                        size="sm"
                        className="text-gray-500"
                      />
                      <span className="text-base font-semibold">
                        {areaSize}
                      </span>
                    </div>
                  )}

                  {yearBuilt && (
                    <div className="flex items-center gap-3xs-2xs">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        size="sm"
                        className="text-gray-500"
                      />
                      <span className="text-base font-semibold">
                        {yearBuilt}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>

            <div className="absolute start-2xs-xs top-2xs-xs flex items-center gap-3xs-2xs">
              {saleAvailability && (
                <div className="rounded-full border border-gray-500 bg-primary-1/30 px-xs-s py-3xs-2xs text-sm text-gray-600 backdrop-blur-md">
                  {t(saleAvailability?.availability)}
                </div>
              )}

              {rentAvailability && (
                <div className="rounded-full border border-gray-500 bg-primary-1/30 px-xs-s py-3xs-2xs text-sm text-gray-600 backdrop-blur-md">
                  {t(rentAvailability?.availability)}
                </div>
              )}
            </div>

            <FavoriteButton listing={listing} />
          </li>
        );
      })}
    </ul>
  );
}
