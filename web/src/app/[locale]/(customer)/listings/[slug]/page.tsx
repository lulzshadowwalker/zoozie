import ZoozImage from "@/components/shared/zooz-image";
import Marquee from "react-fast-marquee";
import {
  faBed,
  faCalendarDays,
  faCouch,
  faLocationDot,
  faMobile,
  faToilet,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IBasePageParams, TListing } from "@types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchApi } from "@/lib/api";
import { notFound } from "next/navigation";
import FollowButton from "@/components/customer/agencies/follow-button";
import MessageButton from "@/components/customer/listings/message-button";
import { getPostHogDistinctId } from "@/lib/actions/posthog";
import PostHogClient from "@/lib/posthog/client";
import { headers } from "next/headers";

export async function generateStaticParams({
  params: { locale },
}: {
  params: IBasePageParams["params"];
}) {
  const res = await fetchApi("/listings", { locale });
  if (!res.ok) {
    console.error(
      "listings/[slug].generateStaticParams: failed to fetch listings",
      res.statusText,
    );
    return [];
  }

  const listings = (await res.json())?.data?.listings as TListing[] | undefined;
  if (!listings) {
    console.error(
      "listings/[slug].generateStaticParams: listings are not in the expected format",
    );
    return [];
  }

  return listings.map((listing) => ({
    slug: listing.slug,
  }));
}

interface Props extends Omit<IBasePageParams, "params"> {
  params: IBasePageParams["params"] & { slug: string };
}

export default async function Listing({ params: { locale, slug } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("customer.listings");

  const res = await fetchApi("/listings/" + slug, {
    queryParams: {
      expand: "agency",
    },
  });
  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error(
      "listings/[slug]: failed to fetch listing " + res.statusText,
    );
  }

  const listing = (await res.json())?.data?.listing as TListing | undefined;
  if (!listing) {
    throw new Error(
      "listings/[slug]: listing is not in the expected format or is empty",
    );
  }

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

  const bedrooms = listing.property?.bedrooms;
  const bathrooms = listing.property?.bathrooms;
  const yearBuilt = listing.property?.yearBuilt;
  const areaSize = listing.property?.area;
  const furnished = listing.property?.furnished;
  const email = listing.agency?.emailAddress;
  const phone = listing.agency?.phoneNumber;
  const agency = listing.agency;

  const posthog = PostHogClient();
  const distinctId = await getPostHogDistinctId();
  const currentUrl = headers().get("x-current-url") || "";
  posthog.capture({
    event: "$pageview",
    distinctId,
    properties: {
      $current_url: currentUrl,
      type: "listing",
      ["listing.id"]: listing?.id,
      ["listing.slug"]: listing?.slug,
      ["agency.id"]: listing?.agency?.id,
      ["agency.slug"]: listing?.agency?.slug,
    },
  });

  return (
    <main className="my-xl-2xl">
      <section>
        <div className="relative mx-auto min-h-[55rem] max-w-page cursor-pointer overflow-hidden rounded-xl">
          <ZoozImage
            src={highlightedPicture?.url ?? ""}
            alt={highlightedPicture?.title ?? ""}
            title={highlightedPicture?.title ?? ""}
            fill
            sizes="(min-width: 1280px) 1200px, calc(93.75vw + 19px)"
            className="object-cover transition-all duration-[800ms] ease-out hover:scale-105"
            priority
            quality={90}
          />
        </div>

        {/* NOTE: for some reason `<Marquee>` doesn't seem to load until all the children are loaded or something of sorts 
        so this wrapper div is to prevent cls */}
        <div className="mt-m-l min-h-[16rem] md:min-h-[26rem]" dir="ltr">
          <Marquee autoFill speed={30}>
            {listing.pictures?.map(({ url, title }, index) => (
              <div
                key={index}
                className="relative mx-2xs-xs aspect-square min-h-[16rem] cursor-pointer overflow-hidden rounded-xl md:min-h-[26rem]"
              >
                <ZoozImage
                  src={url ?? ""}
                  alt={title ?? ""}
                  title={title ?? ""}
                  fill
                  sizes="(min-width: 1180px) 260px, (min-width: 780px) calc(21.05vw + 16px), (min-width: 740px) 160px, calc(22.86vw - 5px)"
                  className="object-cover transition-all duration-[800ms] ease-out hover:scale-105"
                  quality={70}
                />
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      <section className="mx-auto flex max-w-page flex-col-reverse px-page lg:flex-row lg:items-start lg:gap-m-l">
        <section className="flex-grow">
          <section className="mt-l-xl border-t pt-l-xl">
            <div>
              <h2 className="text-xl font-medium">
                {t("what-this-place-offers")}
              </h2>
              <ul className="mt-m-l flex flex-col gap-m-l">
                {areaName && (
                  <li className="flex items-start gap-s-m">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      size="lg"
                      className="flex items-center justify-center rounded-2xl border border-gray-400 bg-gray-300/5 p-xs-s text-gray-400"
                    />
                    <div className="self-center leading-[1.2rem]">
                      <div className="text-lg font-medium">{areaName}</div>
                    </div>
                  </li>
                )}

                {yearBuilt?.value && (
                  <li className="flex items-start gap-s-m">
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      size="lg"
                      className="flex items-center justify-center rounded-2xl border border-gray-400 bg-gray-300/5 p-xs-s text-gray-400"
                    />
                    <div className="self-center leading-[1.2rem]">
                      <div className="text-lg font-medium">
                        {yearBuilt?.value}
                      </div>
                      {yearBuilt?.description && (
                        <p className="max-w-[50ch] text-base text-gray-400">
                          {yearBuilt?.description}
                        </p>
                      )}
                    </div>
                  </li>
                )}

                {bathrooms?.value && (
                  <li className="flex items-start gap-s-m">
                    <FontAwesomeIcon
                      icon={faToilet}
                      size="lg"
                      className="flex items-center justify-center rounded-2xl border border-gray-400 bg-gray-300/5 p-xs-s text-gray-400"
                    />
                    <div className="self-center leading-[1.2rem]">
                      <div className="text-lg font-medium">
                        {bathrooms?.value} {t("bathrooms")}
                      </div>
                      {bathrooms?.description && (
                        <p className="max-w-[50ch] text-base text-gray-400">
                          {bathrooms?.description}
                        </p>
                      )}
                    </div>
                  </li>
                )}

                {bedrooms?.value && (
                  <li className="flex items-start gap-s-m">
                    <FontAwesomeIcon
                      icon={faBed}
                      size="lg"
                      className="flex items-center justify-center rounded-2xl border border-gray-400 bg-gray-300/5 p-xs-s text-gray-400"
                    />
                    <div className="self-center leading-[1.2rem]">
                      <div className="text-lg font-medium">
                        {bedrooms?.value} {t("bedrooms")}
                      </div>
                      {bedrooms?.description && (
                        <p className="max-w-[50ch] text-base text-gray-400">
                          {bedrooms?.description}
                        </p>
                      )}
                    </div>
                  </li>
                )}

                {areaSize?.value && (
                  <li className="flex items-start gap-s-m">
                    <FontAwesomeIcon
                      icon={faUpRightAndDownLeftFromCenter}
                      size="lg"
                      className="flex items-center justify-center rounded-2xl border border-gray-400 bg-gray-300/5 p-xs-s text-gray-400"
                    />
                    <div className="self-center leading-[1.2rem]">
                      <div className="text-lg font-medium">
                        {areaSize?.value} {t("square-meter")}
                      </div>
                      {areaSize?.description && (
                        <p className="max-w-[50ch] text-base text-gray-400">
                          {areaSize?.description}
                        </p>
                      )}
                    </div>
                  </li>
                )}

                {furnished?.value !== undefined && (
                  <li className="flex items-start gap-s-m">
                    <FontAwesomeIcon
                      icon={faCouch}
                      size="lg"
                      className="flex items-center justify-center rounded-2xl border border-gray-400 bg-gray-300/5 p-xs-s text-gray-400"
                    />
                    <div className="self-center leading-[1.2rem]">
                      <div className="text-lg font-medium">
                        {furnished?.value === true
                          ? t("furnished")
                          : t("unfurnished")}
                      </div>
                      {furnished?.description && (
                        <p className="max-w-[50ch] text-base text-gray-400">
                          {furnished?.description}
                        </p>
                      )}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </section>

          {listing.description && (
            <article className="mt-l-xl border-t pt-l-xl">
              <h2 className="text-xl font-medium">{t("about-this-home")}</h2>
              <p className="mt-s-m max-w-readable text-lg text-gray-500">
                {listing.description}
              </p>
            </article>
          )}
        </section>

        <div className="top-[3rem] mt-l-xl w-[34rem] max-w-[34rem] rounded-2xl border border-gray-400 bg-gray-300/20 px-s-m py-m-l lg:sticky">
          {saleAvailability && saleAvailability?.price?.amount && (
            <p className="mb-xs-s border-b-2 pb-xs-s text-xl">
              <strong>{saleAvailability?.price?.amount}</strong>{" "}
              {t(saleAvailability?.price?.currency)}
              <span className="text-base font-light text-gray-500">
                {" "}
                {t("sale-price")}
              </span>
            </p>
          )}

          {rentAvailability && rentAvailability?.price?.amount && (
            <p className="mb-xs-s border-b-2 pb-xs-s text-xl">
              <strong>{rentAvailability?.price?.amount}</strong>{" "}
              {t(rentAvailability?.price?.currency)}
              <span className="text-base font-light text-gray-500">
                {" "}
                {t("rent-price")}
              </span>
            </p>
          )}

          <article>
            <h2 className="text-xl font-medium">{t("contact-info")}</h2>
            <ul className="mt-xs-s flex flex-col gap-2xs-xs">
              {email && (
                <li className="flex items-center gap-3xs-2xs">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <a
                    href={`mailto:${email}`}
                    className="text-lg font-light text-gray-600"
                  >
                    {email}
                  </a>
                </li>
              )}

              {phone?.countryCode && phone?.phoneNumber && (
                <li className="flex items-center gap-3xs-2xs">
                  <FontAwesomeIcon icon={faMobile} />
                  <a
                    href={`tel:${phone?.countryCode + phone?.phoneNumber}`}
                    className="text-lg font-light text-gray-600"
                  >
                    {"+" + phone.countryCode + phone.phoneNumber}
                  </a>
                </li>
              )}
            </ul>
          </article>

          {listing?.agency && <MessageButton agency={listing.agency} />}
        </div>
      </section>

      <section className="mx-auto max-w-page px-page">
        <article className="mt-l-xl border-t pt-l-xl">
          <h2 className="text-xl font-medium">{t("about-this-agency")}</h2>

          <div className="flex flex-col items-stretch gap-xs-s md:flex-row md:items-center">
            <div className="my-m-l flex items-center gap-xs-s">
              <div className="relative aspect-square w-[10rem] overflow-hidden rounded-full md:w-[15rem]">
                <ZoozImage
                  src={listing.agency?.logo ?? ""}
                  alt={`${listing.agency?.name ?? ""} ${t("agency-logo")}`}
                  title={`${listing.agency?.name ?? ""} ${t("agency-logo")}`}
                  fill
                  sizes="(min-width: 780px) 150px, 100px"
                  className="object-cover"
                  priority
                  quality={75}
                />
              </div>

              {agency?.name && (
                <div>
                  <Link href={`/agencies/${agency?.slug}`}>
                    <h3 className="cursor-pointer text-xl font-light">
                      {agency?.name}
                    </h3>
                  </Link>
                  {(agency?.rating || agency?.reviewsCount) && (
                    <Link
                      href={`/agencies/${agency?.slug}#reviews`}
                      className="cursor-pointer text-base font-light text-gray-500 underline-offset-4 hover:underline"
                    >
                      {agency?.rating?.toFixed(1)} ({agency?.reviewsCount}{" "}
                      {agency?.reviewsCount === 1 ? t("review") : t("reviews")})
                    </Link>
                  )}
                </div>
              )}
            </div>

            {agency?.slug && (
              <FollowButton
                slug={agency.slug}
                className="ms-0 py-xs-s md:ms-auto md:py-3xs-2xs"
              />
            )}
          </div>
          {listing.agency?.description && (
            <p className="mt-s-m max-w-readable text-lg text-gray-500">
              {listing.agency?.description}
            </p>
          )}
        </article>
      </section>
    </main>
  );
}
