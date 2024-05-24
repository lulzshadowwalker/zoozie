import Button from "@/components/shared/button";
import ZoozImage from "@/components/shared/zooz-image";
import { IBasePageParams, TAgency } from "@types";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Section from "@/components/customer/agencies/section";
import { fetchApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { getAgencyImage } from "@/lib/utils";
import { Link } from "@/lib/i18n/navigation";
import FollowButton from "@/components/customer/agencies/follow-button";
import { getAccessToken } from "@/lib/actions/auth";
import Reviews from "@/components/customer/agencies/reviews";
import MessageButton from "@/components/customer/agencies/message-button";

export async function generateStaticParams({
  params: { locale },
}: {
  params: IBasePageParams["params"];
}) {
  const res = await fetchApi("/agencies", { locale });
  if (!res.ok) {
    console.error("failed to fetch agencies because ", res.statusText);
    return [];
  }

  const agencies = (await res.json())?.data?.agencies as TAgency[] | undefined;
  if (!agencies) {
    console.error("agencies are not in the expected format");
    return [];
  }

  return agencies.map((agency) => ({
    slug: agency.slug,
  }));
}

interface Props extends Omit<IBasePageParams, "params"> {
  params: IBasePageParams["params"] & { slug: string };
}

export default async function Agency({ params: { locale, slug } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("customer.agency");
  const accessToken = await getAccessToken();
  const headers: Record<string, string> = {};
  accessToken && (headers.Authorization = `Bearer ${accessToken}`);

  const res = await fetchApi("/agencies", {
    init: { headers },
    queryParams: { slug },
  });
  if (!res.ok) {
    if (res.status === 404) notFound();

    throw new Error(
      "agencies/[slug]: failed to fetch agency because " + res.statusText,
    );
  }

  const agency = (await res.json())?.data?.agency as TAgency | undefined;
  if (!agency) {
    throw new Error("agencies/[slug]: agency is not in the expected format");
  }

  return (
    <main className="my-2xl-3xl">
      <section className="mx-auto max-w-page px-page">
        <div className="flex flex-col items-stretch gap-xs-s md:flex-row md:items-center">
          <div className="my-m-l flex items-center gap-xs-s">
            <div className="relative aspect-square w-[10rem] overflow-hidden rounded-full md:w-[15rem]">
              <ZoozImage
                src={getAgencyImage(agency.logo)}
                alt={agency.name ?? t("logo")}
                title={agency.name ?? t("logo")}
                fill
                sizes="(min-width: 780px) 150px, 100px"
                className="object-cover"
                priority
                quality={75}
              />
            </div>

            <div>
              <h3 className="cursor-pointer text-xl font-light">
                {agency.name}
              </h3>
              {(agency.rating || agency.reviewsCount) && (
                <Link
                  href="#reviews"
                  className="cursor-pointer text-base font-light text-gray-500 underline-offset-4 hover:underline"
                >
                  {agency.rating?.toFixed(1)} ({agency.reviewsCount}{" "}
                  {agency.reviewsCount === 1 ? t("review") : t("reviews")})
                </Link>
              )}
            </div>
          </div>

          <section className="flex items-center gap-xs-s md:ms-auto">
            {agency?.slug && <FollowButton slug={agency.slug} />}
            <MessageButton agency={agency} />
          </section>
        </div>
      </section>
      {agency.description && (
        <Section>
          <article>
            <h2 className="text-xl font-medium">
              {agency.name
                ? `${t("about")} ${agency.name}`
                : t("about-this-agency")}
            </h2>
            <p className="mt-s-m max-w-readable text-lg text-gray-500">
              {agency.description}
            </p>
          </article>
        </Section>
      )}

      {(agency.phoneNumber || agency.emailAddress) && (
        <Section>
          <article>
            <h2 className="text-xl font-medium">{t("contact-information")}</h2>
            <ul className="mt-m-l flex flex-col gap-m-l">
              {agency.emailAddress && (
                <li className="flex items-center gap-s-m">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="flex items-center justify-center rounded-2xl bg-gray-200 p-xs-s"
                  />
                  <a
                    className="text-lg font-medium text-gray-500"
                    href={`mailto:${agency.emailAddress}`}
                  >
                    {agency.emailAddress}
                  </a>
                </li>
              )}
              {agency.phoneNumber && (
                <li className="flex items-center gap-s-m">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="flex items-center justify-center rounded-2xl bg-gray-200 p-xs-s"
                  />
                  <a
                    className="text-lg font-medium text-gray-500"
                    href="tel:12345678"
                  >
                    {agency.phoneNumber.countryCode}{" "}
                    {agency.phoneNumber.phoneNumber}
                  </a>
                </li>
              )}
            </ul>
          </article>
        </Section>
      )}

      <Reviews agency={agency} />

      {/* NOTE: I don't want this button to be fluid in spacings or font size */}
      <Link href={`/listings?agency=${agency.slug}`}>
        <Button className="fixed bottom-m-l right-m-l px-[2rem] py-[0.625rem] text-[1.5rem]">
          {t("view-listings")}
        </Button>
      </Link>
    </main>
  );
}
