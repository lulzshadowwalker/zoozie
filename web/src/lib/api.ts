import Config from "@/lib/config";
import useSWR from "swr";
import path from "path";
import { useParams } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Locale } from "@/lib/i18n/config";

const lulzieApiBaseUrl = Config.apiBaseUrl;
const strapiBaseUrl = Config.strapiBaseUrl;

export function useFetchApi(
  endpoint: string,
  { queryParams }: BaseRequestOptions = {},
) {
  const { locale } = useParams();
  const url = generateApiUrl({
    endpoint,
    queryParams,
    source: "lulzie", // NOTE: do not expose the Strapi access token on the client side
    locale: locale as Locale,
  });

  const startTime = performance.now();
  const res = useSWR(url.href, async function handleFetchApi(url) {
    return fetch(url).then((res) => res.json());
  });
  const endTime = performance.now();
  // if (Config.environment === "development") {
  //   console.info(
  //     "%s (elapsed time: %f)",
  //     url,
  //     (endTime - startTime).toFixed(2),
  //   );
  // }

  return res;
}

export async function fetchApi(
  endpoint: string,
  {
    init,
    queryParams,
    locale,
    source,
  }: { locale?: Locale } & ServerRequestOptions = {},
) {
  if (!locale && source !== "strapi") {
    const lang = (await getLocale()) as Locale;
    locale = lang;
  }

  let requestOptions: RequestInit = init ?? {};
  let headers: Record<string, string> = headersInitToRecord(
    init?.headers ?? {},
  );
  if (source === "strapi") {
    headers["Authorization"] = `Bearer ${Config.strapiAccessToken}`;
    requestOptions.headers = headers;
  }

  const url = generateApiUrl({ endpoint, queryParams, locale, source });
  const startTime = performance.now();
  const res = await fetch(url, requestOptions); // TODO: might want to use a default revalidation duration
  const endTime = performance.now();
  console.info(
    "%s (status: %d, elapsed time: %fms)",
    url,
    res.status,
    (endTime - startTime).toFixed(2),
  );
  return res;
}

export function generateApiUrl({
  endpoint,
  locale,
  queryParams,
  source,
}: { endpoint: string; locale?: Locale } & BaseRequestOptions) {
  source = source ?? "lulzie";
  let url: URL | undefined = undefined;

  switch (source) {
    case "lulzie":
      url = new URL(path.join(lulzieApiBaseUrl, locale as string, endpoint));
      break;
    case "strapi":
      url = new URL(path.join(strapiBaseUrl, endpoint));
      break;
    default:
      throw new Error(`Unsupported source: ${source}`);
  }

  let q: Record<string, string | string[]> = queryParams ?? {};
  if (source === "strapi" && !q["locale"]) {
    q["locale"] = locale ?? "en";
  }

  if (q) {
    for (const [key, value] of Object.entries(q)) {
      if (Array.isArray(value)) {
        if (source === "strapi") {
          url.searchParams.append(key, value.join(","));
          continue;
        }

        for (const v of value) {
          url.searchParams.append(key, v);
        }
        continue;
      }

      url.searchParams.set(key, value);
    }
  }

  return url;
}

export function headersInitToRecord(
  headersInit: HeadersInit,
): Record<string, string> {
  const headers: Record<string, string> = {};

  if (headersInit instanceof Headers) {
    headersInit.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (Array.isArray(headersInit)) {
    headersInit.forEach(([key, value]) => {
      headers[key] = value;
    });
  } else {
    Object.entries(headersInit).forEach(([key, value]) => {
      headers[key] = value;
    });
  }

  return headers;
}

export function getStrapiFileUrl(v: string | undefined): URL | undefined {
  if (!v) return undefined;
  return new URL(path.join("http://localhost:1337", v));
}

interface ServerRequestOptions extends BaseRequestOptions {
  init?: RequestInit;
}

interface BaseRequestOptions {
  /**
   * defaults to `lulzie`
   */
  source?: "strapi" | "lulzie";
  queryParams?: Record<string, string | string[]>;
}
