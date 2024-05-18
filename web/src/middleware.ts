import createMiddleware from "next-intl/middleware";
import { config as i18nConfig } from "@/lib/i18n/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";

const handleI18nRouting = createMiddleware(i18nConfig);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = cookies().get("access-token")?.value;

  if (pathname.includes("auth") && token) {
    return redirect(request, "/");
  }

  if (pathname.includes("favorites")) {
    try {
      const claims = await authenticate(token);
      if (claims.role !== "CUSTOMER") {
        console.debug("redirecting to 403");
        return redirect(request, "/403");
      }
    } catch (e) {
      console.debug("redirecting to register");
      return redirect(request, "/auth/register");
    }
  }

  return handleI18nRouting(request);
}

/**
 * Redirects the user to a different page within the application preserving localization.
 *
 * @param {NextRequest} request - The incoming request object.
 * @param {string} pathname - The pathname to redirect to.
 * @return {NextResponse} The redirect response.
 */
function redirect(request: NextRequest, pathname: string): NextResponse {
  let nextUrl = request.nextUrl;
  const originalPathname = nextUrl.pathname;
  const [_, locale] = originalPathname.split("/");

  nextUrl.pathname = `/${locale}/${pathname}`;
  return NextResponse.redirect(nextUrl);
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
