import { useTranslations } from "next-intl";

export default function Stats() {
  const t = useTranslations("customer.home.stats");

  const stats = [
    {
      title: "3,417,671",
      description: t("page-views"),
    },
    {
      title: "1,815",
      description: t("listings-for-sale"),
    },
    {
      title: "756",
      description: t("listings-for-rent"),
    },
    {
      title: t("500M"),
      description: t("in-property-sales"),
    },
  ] as const;

  return (
    <section className="mx-auto my-2xl-3xl max-w-page px-page">
      <h2 className="mb-m-l text-center text-2xl font-semibold">
        {t("title")}
      </h2>
      <ul className="flex flex-wrap items-center justify-center gap-l-xl">
        {stats.map(({ title, description }, index) => (
          <li key={index} className="space-y-[1rem]">
            <p className="text-3xl font-bold text-accent-1">{title}</p>
            <p className="text-lg font-light text-gray-400">{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
