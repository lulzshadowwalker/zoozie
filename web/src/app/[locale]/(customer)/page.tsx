import { IBasePageParams } from "@types";
import FeaturedListings from "@/components/customer/home/featured-listings";
import Hero from "@/components/customer/home/hero";
import dynamic from "next/dynamic";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import ZoozImage from "@/components/shared/zooz-image";
import Button from "@/components/shared/button";
import { SellYourHome } from "@/components/customer/home/sell-your-home";
import Stats from "@/components/customer/home/stats";

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
      <Stats />
    </main>
  );
}
