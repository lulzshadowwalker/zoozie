import createMiddleware from "next-intl/middleware";
import { config as i18nConfig } from "./lib/i18n/config";

export default createMiddleware(i18nConfig);

export const config = {
  // NOTE: modify the middleware's matcher when modifying the supported locales
  // Match only internationalized pathnames
  matcher: ["/", "/(ru|en)/:path*"],
};
