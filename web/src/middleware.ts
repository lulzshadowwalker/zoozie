import createMiddleware from "next-intl/middleware";
import { config as i18nConfig } from "./lib/i18n/config";

export default createMiddleware(i18nConfig);

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
