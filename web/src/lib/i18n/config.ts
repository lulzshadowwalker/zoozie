import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export type Locale = (typeof config.locales)[number];
export const config = {
  locales: ["en", "ru"],
  defaultLocale: "en",
} as const;

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!config.locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
