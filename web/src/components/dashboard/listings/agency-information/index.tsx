import Button from "@/components/shared/button";
import ZoozImage from "@/components/shared/zooz-image";
import { fetchApi } from "@/lib/api";
import { Link } from "@/lib/i18n/navigation";
import { TAgency } from "@/lib/types";
import { getAgencyImage } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function AgencyInformation({ slug }: { slug: string }) {
  const t = await getTranslations("dashboard.create-listing");
  const res = await fetchApi("/agencies", {
    queryParams: { slug },
  });
  if (!res.ok) {
    console.error("failed to fetch agency because " + res.statusText);
    return <></>;
  }

  const agency = (await res.json())?.data?.agency as TAgency | undefined;
  if (!agency) {
    throw new Error("agency is not in the expected format");
  }

  return (
    <section className="mx-auto max-w-page px-page">
      <article className="mt-l-xl border-t pt-l-xl">
        <h2 className="text-xl font-medium">{t("about-this-agency")}</h2>

        <div className="flex flex-col items-stretch gap-xs-s md:flex-row md:items-center">
          <div className="my-m-l flex items-center gap-xs-s">
            <div className="relative aspect-square w-[10rem] overflow-hidden rounded-full md:w-[15rem]">
              <ZoozImage
                src={getAgencyImage(agency.logo)}
                alt={(agency.name ?? "") + ` ${t("logo")}`}
                title={(agency.name ?? "") + ` ${t("logo")}`}
                fill
                sizes="(min-width: 780px) 150px, 100px"
                className="object-cover"
                priority
                quality={75}
              />
            </div>

            <div className="pointer-events-none">
              <Link href={`/agencies/${agency.slug}`}>
                <h3 className="cursor-pointer text-xl font-light">
                  Railway Real-estate™
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
          </div>

          <Button
            typ="secondary"
            className="pointer-events-none ms-0 py-xs-s md:ms-auto md:py-3xs-2xs"
          >
            {t("follow")}
          </Button>
        </div>

        {agency.description && (
          <p className="mt-s-m max-w-readable text-lg text-gray-500">
            {agency.description}
          </p>
        )}
      </article>
    </section>
  );
}
