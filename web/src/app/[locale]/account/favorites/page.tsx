import ZoozImage from "@/components/shared/zooz-image";
import { Link } from "@/lib/i18n/navigation";
import { IBasePageParams } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function Favorites({ params: { locale }}: IBasePageParams) {
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
            {
              [...Array(5)].map((_, index) => (
                <li key={index}>
                  <Link
                    href="/listings/foo"
                    className="border rounded-xl shadow-md p-m-l min-h-[28rem] dark:shadow-none flex flex-col gap-m-l group hover:bg-gray-100/70 !outline-none md:flex-row md:justify-between"
                  >
                    <div>
                      <p className="text-lg text-gray-400">
                        Modern Style House <br />
                        <span className="font-bold text-on-primary-1">
                          $2,500,000
                        </span>
                        <br />3 beds, 2 baths, 1,500 sqft
                      </p>
                    </div>

                    <div className="flex-grow relative rounded-lg overflow-hidden md:max-w-[30rem]">
                      <ZoozImage
                        src="https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                        title=""
                        fill
                        sizes="(min-width: 780px) 300px, calc(90.65vw - 91px)"
                        className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </li>
              ))
            }
          </ul>
        </section>
      </section>
    </main>
  );
}
