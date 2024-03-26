import Button from "@/components/shared/button";
import ZoozImage from "@/components/shared/zooz-image";
import { IBasePageParams } from "@types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import Header from "@/components/dashboard/shared/header";
import ImageInput from "@/components/dashboard/listings/image-input";
import CoreFeatures from "@/components/dashboard/listings/core-features";
import PriceCard from "@/components/dashboard/listings/price-card";
import DescriptionInput from "@/components/dashboard/listings/core-features/description-input";
import ExtraFeatures from "@/components/dashboard/listings/extra-features";

export const dynamic = "force-static";

export default async function Listing({ params: { locale } }: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("dashboard.create-listing");

  return (
    <main>
      <Header leading={<h2 className="text-2xl">{t("create-listing")}</h2>} />

      <div className="my-xl-2xl">
        <ImageInput />
        <section className="max-w-page mx-auto px-page flex flex-col-reverse lg:flex-row lg:gap-m-l lg:items-start">
          <section className="flex-grow">
            <CoreFeatures />
            <DescriptionInput />

            {/* NOTE: EXTRA FEATURES aka amenities */}
            <ExtraFeatures />
          </section>

          <PriceCard />
        </section>

        {/* FIXME: I think the padding needs to be fixed on this on or above */}
        <section className="max-w-page mx-duto px-page">
          <article className="mt-l-xl pt-l-xl border-t">
            <h2 className="text-xl font-medium">About this agency</h2>

            <div className="flex flex-col items-stretch gap-xs-s md:flex-row md:items-center">
              <div className="flex items-center gap-xs-s my-m-l">
                <div className="md:w-[15rem] w-[10rem] aspect-square rounded-full relative overflow-hidden">
                  <ZoozImage
                    src="https://images.unsplash.com/photo-1709418354495-fc4e5dd6d1f3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    title=""
                    fill
                    sizes="(min-width: 780px) 150px, 100px"
                    className="object-cover"
                    priority
                    quality={75}
                  />
                </div>

                <div>
                  <Link href="/agencies/foo">
                    <h3 className="text-xl font-light cursor-pointer">
                      Railway Real-estate™
                    </h3>
                  </Link>
                  <Link
                    href="/agencies/foo#reviews"
                    className="text-base text-gray-500 font-light underline-offset-4 hover:underline cursor-pointer"
                  >
                    5.0 (12 reviews)
                  </Link>
                </div>
              </div>

              <Button
                typ="secondary"
                className="ms-0 py-xs-s md:py-3xs-2xs md:ms-auto"
              >
                Follow
              </Button>
            </div>

            <p className="text-lg text-gray-500 max-w-readable mt-s-m">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
              minima odio quod mollitia optio ipsum iusto cumque laboriosam
              officia fuga dolorum vel eos reprehenderit ab excepturi harum
              quisquam, unde porro. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Obcaecati quibusdam ducimus illum architecto
              doloremque numquam consectetur error. Cumque optio magnam quod
              tenetur dolore iste eveniet, accusantium harum, ex aperiam hic!
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
