import Config from '@/lib/config';
import useSWR from 'swr';
import path from 'path';
import { useParams } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { Locale } from '@/lib/i18n/config';

const baseUrl = Config.apiBaseUrl;

export function useFetchApi(
  endpoint: string,
  { queryParams }: BaseRequestOptions = {},
) {
  const { locale } = useParams();
  const url = generateApiUrl({
    endpoint,
    queryParams,
    locale: locale as Locale,
  });

  const startTime = performance.now();
  const res = useSWR(url.href, async function handleFetchApi(url) {
    return fetch(url).then((res) => res.json());
  });
  const endTime = performance.now();
  if (Config.environment === 'development') {
    console.info('%s (elapsed time: %f)', url, (endTime - startTime).toFixed(2));
  }

  return res;
}

export async function fetchApi(
  endpoint: string,
  {
    init,
    queryParams,
    locale,
  }: { locale?: Locale } & ServerRequestOptions = {},
) {
  if (!locale) {
    const lang = (await getLocale()) as Locale;
    locale = lang;
  }

  const url = generateApiUrl({ endpoint, queryParams, locale });
  const startTime = performance.now();
  const res = await fetch(url, init); // TODO: might want to use a default revalidation duration
  const endTime = performance.now();
  console.info(
    '%s (status: %d, elapsed time: %fms)',
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
}: { endpoint: string; locale: Locale } & BaseRequestOptions) {
  const url = new URL(path.join(baseUrl, locale as string, endpoint));

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.set(key, value);
    }
  }

  return url;
}

interface ServerRequestOptions extends BaseRequestOptions {
  init?: RequestInit;
}

interface BaseRequestOptions {
  queryParams?: Record<string, string>;
}
