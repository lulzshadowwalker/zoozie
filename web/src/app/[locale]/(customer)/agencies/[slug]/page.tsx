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
import { useTranslations } from "next-intl";
import FollowButton from "@/components/customer/agencies/follow-button";
import { getAccessToken } from "@/lib/actions/auth";

export async function generateStaticParams({
  params: { locale },
}: IBasePageParams) {
  const res = await fetchApi("/agencies", { locale });
  if (!res.ok) {
    console.error("failed to fetch agencies because ", res.statusText);
    return;
  }

  const agencies = (await res.json())?.data?.agencies as TAgency[] | undefined;
  if (!agencies) {
    console.error("agencies are not in the expected format");
    return;
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

  const res = await fetchApi("/agencies", {
    init: { headers: { Authorization: `Bearer ${accessToken}` } },
    queryParams: { slug },
  });
  if (!res.ok) {
    if (res.status === 404) notFound();

    throw new Error(
      "agencies/[slug]: failed to fetch agency because" + res.statusText,
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
              <p className="cursor-pointer text-base font-light text-gray-500 underline-offset-4 hover:underline">
                {/* TODO: agency rating and review count  */}
                5.0 (12 reviews)
              </p>
            </div>
          </div>

          <section className="flex items-center gap-xs-s md:ms-auto">
            <FollowButton agency={agency} />
            <Button className="ms-0 flex-grow basis-0 py-xs-s md:flex-grow-0 md:py-3xs-2xs">
              {t("message")}
            </Button>
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
      <Section>
        <article className="mt-l-xl flex flex-col border-t pt-l-xl">
          <h2 className="text-xl font-medium">Reviews</h2>
          <ul className="mt-m-l flex flex-col gap-l-xl">
            {[...Array(3)].map((_, index) => (
              <li className="flex items-start gap-s-m" key={index}>
                <div className="relative h-xl-2xl w-xl-2xl overflow-hidden rounded-3xl">
                  <ZoozImage
                    src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    title=""
                    fill
                    sizes="(min-width: 1340px) 50px, (min-width: 620px) calc(1.71vw + 27px), calc(7.67vw - 8px)"
                    quality={65}
                  />
                </div>
                <div className="self-center leading-[1.2rem]">
                  <h3 className="text-lg text-gray-400">Customer Name</h3>
                  <p className="mt-2xs-xs max-w-[50ch] text-lg text-on-primary-1/80">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Quisquam odit fugit nihil fugiat quam autem quae nam modi
                    amet incidunt.
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <button className="ms-auto mt-xs-s underline underline-offset-4 outline-none hover:decoration-transparent focus:decoration-transparent">
            {t("view-more")}
          </button>
        </article>
      </Section>

      {/* NOTE: I don't want this button to be fluid in spacings or font size */}
      <Link href={`/listings?agency=${agency.slug}`}>
        <Button className="fixed bottom-m-l end-m-l px-[2rem] py-[0.625rem] text-[1.5rem]">
          {t("view-listings")}
        </Button>
      </Link>
    </main>
  );
}
