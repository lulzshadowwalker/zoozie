import { IBaseAgencyParams, IBasePageParams } from "@types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "@/lib/i18n/navigation";
import Header from "@/components/dashboard/shared/header";
import ImageInput from "@/components/dashboard/listings/image-input";
import CoreFeatures from "@/components/dashboard/listings/core-features";
import PriceCard from "@/components/dashboard/listings/price-card";
import DescriptionInput from "@/components/dashboard/listings/core-features/description-input";
import ExtraFeatures from "@/components/dashboard/listings/extra-features";
import BasicInfo from "@/components/dashboard/listings/basic-info";
import SaveButton from "@/components/dashboard/listings/save-button";
import { authenticate, forbidden, Forbidden, TokenNotFound } from "@/lib/auth";
import { cookies } from "next/headers";
import AgencyInformation from "@/components/dashboard/listings/agency-information";

export default async function Listing({
  params: { locale, agency },
}: IBaseAgencyParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("dashboard.create-listing");
  try {
    const claims = await authenticate(cookies().get("access-token")?.value);
    if (claims.agencySlug !== agency) forbidden();
  } catch (e) {
    if (e instanceof Forbidden) redirect("/403");
    if (e instanceof TokenNotFound) redirect("/auth/register");
    throw e;
  }

  return (
    <main>
      <Header leading={<h2 className="text-2xl">{t("create-listing")}</h2>} />

      <div className="my-xl-2xl">
        <ImageInput />

        <section className="mx-auto flex max-w-page flex-col-reverse px-page lg:flex-row lg:items-start lg:gap-m-l">
          <section className="flex-grow">
            <BasicInfo />
            <CoreFeatures />
            <DescriptionInput />

            {/* NOTE: EXTRA FEATURES aka amenities */}
            <ExtraFeatures />
          </section>

          <PriceCard />
        </section>

        <AgencyInformation slug={agency} />
      </div>
      <SaveButton />
    </main>
  );
}
