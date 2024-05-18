import Button from "@/components/shared/button";
import ZoozImage from "@/components/shared/zooz-image";
import { useTranslations } from "next-intl";

export function SellYourHome() {
  const t = useTranslations("customer.home.sell-your-home");

  const steps = [
    {
      title: t("steps.step-1.title"),
      image:
        "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: t("steps.step-2.title"),
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: t("steps.step-3.title"),
      image:
        "https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ] as const;

  return (
    <section className="my-2xl-3xl px-page">
      <h2 className="mx-auto mb-m-l text-balance text-center text-2xl font-semibold">
        {t("title")}
      </h2>

      <div className="mx-auto grid max-w-[100rem] grid-cols-[repeat(auto-fit,minmax(28rem,1fr))] place-content-center gap-2xs-xs">
        {steps.map(({ title, image }, index) => (
          <div
            key={index}
            className="group min-h-[28rem] overflow-hidden rounded-2xl border border-gray-300 drop-shadow-sm dark:drop-shadow-none"
          >
            <h3 className="mb-s-m p-s-m text-[1.8rem] text-gray-600 dark:text-gray-400">
              {title}
            </h3>
            <div className="relative h-[20rem] overflow-hidden rounded-2xl">
              <ZoozImage
                src={image}
                alt={`${t("step")} ${index + 1}}`}
                fill
                sizes="(min-width: 1240px) 325px, (min-width: 1000px) calc(20.45vw + 75px), (min-width: 680px) calc(46.33vw - 37px), (min-width: 400px) calc(93.08vw - 67px), calc(11.25vw + 244px)"
                className="transition-all duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>

      <Button className="mx-auto mt-xl-2xl px-2xl-3xl py-s-m">
        {t("get-started")}
      </Button>
    </section>
  );
}
