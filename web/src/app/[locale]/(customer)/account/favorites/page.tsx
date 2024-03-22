import Card from "@/components/customer/listings/card";
import { IBasePageParams } from "@types";
import { cn } from "@/lib/utils";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function Favorites({
  params: { locale },
}: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("account-favorites");

  const sampleFilters: string[] = ["All", "Property", "Agencies"];

  return (
    <main className="my-2xl-3xl">
      <section className="max-w-page mx-auto px-page">
        <article>
          <h2 className="text-3xl font-semibold">{t("your-favorites")}</h2>

          <search className="mb-s-m mt-l-xl border-b">
            <ul className="flex items-center gap-s-m">
              {sampleFilters.map((filter, index) => (
                <li key={index}>
                  <button
                    className={cn(
                      "text-xl font-bold outline-none transition-all focus:translate-y-[-0.25rem] pb-s-m",
                      {
                        "font-medium text-gray-500 hover:text-on-primary-1 focus:text-on-primary-1":
                          index !== 0, // in case of inactive
                      },
                      {
                        "border-b-[4px] border-accent-1": index === 0,
                      },
                    )}
                  >
                    {filter}
                  </button>
                </li>
              ))}
            </ul>
          </search>
        </article>

        <section>
          <ul className="space-y-m-l">
            {[...Array(5)].map((_, index) => (
              <li key={index}>
                <Card />
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
