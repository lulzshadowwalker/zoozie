import { IBasePageParams } from "@types";
import FeaturedListings from "@/components/customer/home/featured-listings";
import Hero from "@/components/customer/home/hero";
import dynamic from "next/dynamic";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import ZoozImage from "@/components/shared/zooz-image";
import Button from "@/components/shared/button";
import { SellYourHome } from "@/components/customer/home/sell-your-home";

const Partners = dynamic(() => import("@/components/customer/home/partners"));

export default async function Home({ params: { locale } }: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("customer.home");

  return (
    <main className="my-xl-2xl">
      <Hero />
      <FeaturedListings />
      <Partners />
      <SellYourHome />

      <section className="mx-auto my-l-xl max-w-page px-page">
        <h2 className="text-center text-2xl font-semibold">
          {t("appreciate-trust")}
        </h2>
        <p className="my-m-l text-center text-4xl font-medium leading-[3.2rem] text-gray-500">
          3, 416, 214
          <br />
          <span className="text-xl font-normal">{t("total-visits")}</span>
        </p>
      </section>
    </main>
  );
}
