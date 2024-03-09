import { IBasePageParams } from "@/lib/types/types";
import { useTranslations } from "next-intl";
import FeaturedListings from "@/components/home/featured-listings";
import Hero from "@/components/home/hero";
import dynamic from "next/dynamic";

const Partners = dynamic(() => import("@/components/home/partners"));

export default function Home({}: IBasePageParams) {
  const t = useTranslations("home");

  return (
    <main className="my-xl-2xl">
      <Hero />
      <FeaturedListings />

      {/* TODO: try and use dynamic import for Partners client component */}
      <Partners />

      <section className="my-l-xl max-w-page px-page mx-auto">
        <h2 className="text-2xl font-semibold text-center">
          {t("appreciate-trust")}
        </h2>
        <p className="text-4xl text-center font-medium text-gray-500 my-m-l leading-[3.2rem]">
          3, 416, 214
          <br />
          <span className="text-xl font-normal">{t("total-visits")}</span>
        </p>
      </section>
    </main>
  );
}
