import { Link } from "@/lib/i18n/navigation";
import ZoozImage from "../../../shared/zooz-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCalendarDays,
  faLocationDot,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { TListing } from "@/lib/types";
import { getTranslations } from "next-intl/server";

type Props = {
  // TODO: make listings required
  listings?: TListing[];
};

export default async function Listings({ listings }: Props) {
  const t = await getTranslations("customer.listings");
  const sampleImages: string[] = [
    "https://images.unsplash.com/photo-1551429340-1a7a56cde81f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1612200167908-f55e26ada541?q=80&w=2866&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1434873740857-1bc5653afda8?q=80&w=2900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <ul className="mt-s-m grid grid-cols-[repeat(auto-fit,minmax(25.5rem,16rem))] place-content-start gap-3xs-2xs max-[622px]:grid-cols-1 sm:place-content-start">
      {listings
        ? listings.map((listing, index) => {
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
              saleAvailability?.price?.amount ??
              rentAvailability?.price?.amount;
            const currency =
              saleAvailability?.price?.currency ??
              rentAvailability?.price?.currency;

            const bedrooms = listing.property?.bedrooms?.value;
            const yearBuilt = listing.property?.yearBuilt?.value;
            const areaSize = listing.property?.area?.value;

            return (
              <li
                key={index}
                className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl shadow-md dark:shadow-none"
              >
                <Link href="/listings/foo" className="group">
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
                          <span className="text-lg font-semibold">
                            {areaName}
                          </span>
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
              </li>
            );
          })
        : [...sampleImages, ...sampleImages.reverse()].map((image, index) => (
            <li
              key={index}
              className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl shadow-md dark:shadow-none"
            >
              <Link href="/listings/foo" className="group">
                <ZoozImage
                  src={image}
                  alt=""
                  title=""
                  fill
                  sizes="(min-width: 640px) 255px, calc(92.81vw - 64px)"
                  className="object-cover transition-all duration-[800ms] ease-out hover:scale-105 group-focus:scale-110"
                  quality={75}
                />

                <div className="absolute bottom-0 flex min-h-[7rem] w-full flex-col justify-center gap-3xs-2xs bg-primary-1/60 px-s-m py-2xs-xs backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3xs-2xs">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-gray-600"
                      />
                      <span className="text-lg font-semibold">Abdoun</span>
                    </div>

                    <p className="text-lg">
                      <strong className="font-medium">20,500</strong>
                      <span className="text-base">JOD</span>
                    </p>
                  </div>

                  <div className="flex justify-start space-x-xs-s">
                    {[...Array(3)].map((_, index) => (
                      <div
                        className="flex items-center gap-3xs-2xs"
                        key={index}
                      >
                        <FontAwesomeIcon
                          icon={faBed}
                          size="sm"
                          className="text-gray-500"
                        />
                        <span className="text-base font-semibold">5</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
    </ul>
  );
}
