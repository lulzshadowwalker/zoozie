import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";
import {
  IBasePageParams,
  TListingFilters,
  TUser,
  TZoozieUserMessage,
} from "@types";
import { toast } from "react-toastify";
import { getLocale, getTranslations } from "next-intl/server";
import { Locale } from "./i18n/config";
import path from "path";
import Config from "./config";
import { agencyFallbackImage, customerFallbackImage } from "./constants";
import { listingTypes } from "./const";
import { load } from "cheerio";

/**
 * intelligently applies your tailwind overrides and conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function showToast(
  message: TZoozieUserMessage | Promise<TZoozieUserMessage>,
) {
  if (isClientSide()) {
    toast.dismiss();
  }

  isPromise(message)
    ? await showToastAsync(message as Promise<TZoozieUserMessage>)
    : showToastSync(message as TZoozieUserMessage);
}

export function isPromise(value: unknown): value is Promise<unknown> {
  return !!value && typeof (value as Promise<unknown>).then === "function";
}

async function showToastAsync(message: Promise<TZoozieUserMessage>) {
  const t = await getTranslations();

  toast.promise(message, {
    pending: {
      render() {
        return t("working-on-it");
      },
    },
    success: {
      render({ data }) {
        return data.message;
      },
    },
    error: {
      render() {
        return t("something-went-wrong");
      },
    },
  });
}

function showToastSync(message: TZoozieUserMessage): void {
  switch (message.status) {
    case "success":
      toast.success(message.message);
      break;
    case "failure":
      toast.error(message.message);
      break;
    case "warning":
      toast.warning(message.message);
      break;
    case "info":
      toast.info(message.message);
      break;
    default:
      console.error("utils.showToast: unknown message status", message);
  }
}

/**
 * Translates text from one language to another using the internal API
 * @param input Text to be translated
 * @param from Source language code
 * @param to Destination language code
 * @returns Promise that resolves to the translated text if successful, or undefined if there was an error
 */
export async function translate(
  input: string,
  from: Locale,
  to: Locale,
): Promise<string | undefined> {
  try {
    const uri = Config.translationApiBaseUrl;
    if (!uri) {
      console.error("translationApiBaseUrl is not set");
      return undefined;
    }

    const url = path.join(uri, "translate");
    const res = await fetch(new URL(url).href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: input,
        source: from,
        target: to,
      }),
    });

    if (!res.ok) {
      console.error("translate: failed to translate", res.statusText);
      return undefined;
    }

    const payload = await res.json();
    const translatedText = payload?.translatedText as string | undefined;

    if (!translatedText) {
      console.error("translatedText cannot be empty");
      return undefined;
    }

    return translatedText;
  } catch (e) {
    console.error("translate: failed to translate", e);
    return undefined;
  }
}

export function isClientSide() {
  return typeof window !== "undefined";
}

/**
 * Returns the user's profile picture based on the provided user's role.
 *
 * @param {TUser | undefined} user - The user object containing the profile picture.
 * @return {string} The user's profile picture URL. If the user object is undefined or does not have a profile picture, the function returns the corresponding fallback image URL.
 */
export function getUserImage(user?: TUser): string {
  if (user?.role === "AGENCY_AGENT") {
    return user?.profilePicture || agencyFallbackImage;
  }

  return user?.profilePicture || customerFallbackImage;
}

/**
 * Retrieves the customer image based on the provided image or fallback to a default image.
 *
 * @param {string | undefined} image - The image URL to retrieve or undefined.
 * @return {string} The customer image URL.
 */
export function getCustomerImage(image?: string | null): string {
  return image?.length ? image : customerFallbackImage;
}

/**
 * Retrieves the agency image based on the provided image or fallback to a default image.
 *
 * @param {string | undefined} image - The image URL to retrieve or undefined.
 * @return {string} The agency image URL.
 */
export function getAgencyImage(image: string | undefined): string {
  return image?.length ? image : agencyFallbackImage;
}

export function isEmptyObject(obj: any): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function extractListingsFiltersFromSearchParams(
  q: URLSearchParams,
): TListingFilters {
  const params: TListingFilters = {};

  const availability = q.get("availability");
  if ((availability && availability === "RENT") || availability === "SALE") {
    params.availability = availability;
  }

  const prices = {
    minRentPrice: q.get("minRentPrice"),
    maxRentPrice: q.get("maxRentPrice"),
    minSalePrice: q.get("minSalePrice"),
    maxSalePrice: q.get("maxSalePrice"),
    minBedrooms: q.get("minBedrooms"),
    minBathrooms: q.get("minBathrooms"),
  };

  for (const [key, value] of Object.entries(prices)) {
    if (!value) continue;
    const v = parseInt(value);
    if (!isNaN(v)) {
      params[
        key as "minRentPrice" | "maxRentPrice" | "minSalePrice" | "maxSalePrice"
      ] = v;
    }
  }

  const propertyType = q.get("type");
  if (propertyType && listingTypes.includes(propertyType as any)) {
    params.type = propertyType as (typeof params)["type"];
  }

  return params;
}

export function pageSearchParamsToURLSearchParams(
  searchParams: IBasePageParams["searchParams"],
): URLSearchParams {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (!value) continue;

    // I am too lazy to test this, hope it works.
    if (Array.isArray(value)) {
      for (const v of value) {
        q.append(key, v);
      }
      continue;
    }

    q.set(key, value);
  }

  return q;
}

// FIXME: `formatDateTime` does not accurately calculate the difference between the datetimes from the API and the current local time
export async function formatDateTime(
  v: string | Date | number,
): Promise<string> {
  const t = await getTranslations();
  const locale = await getLocale();

  const now = new Date();
  const dateTime = new Date(v);
  const difference = now.getTime() - dateTime.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (difference <= minute) {
    return t("just-now");
  } else if (difference <= hour) {
    const minutesAgo = Math.floor(difference / (60 * 1000));
    return `${minutesAgo} ${t("minutes-ago")}`;
  } else if (difference <= day) {
    return dateTime.toLocaleTimeString(locale === "ar" ? "ar-JO" : "en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  } else {
    return dateTime.toLocaleDateString(locale === "ar" ? "ar-JO" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}

/**
 * Shuffles the elements of an array randomly.
 *
 * @param {T[]} array - The array to be shuffled.
 * @return {T[]} The shuffled array.
 */
export function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Estimates the reading time of an HTML content.
 *
 * @param {string} content - The HTML content to estimate the reading time for.
 * @return {number} The estimated reading time in minutes.
 */
export function estimateReadingTime(content: string): number {
  const $ = load(content);
  const textContent = $.text();
  const wordCount = textContent
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const wordsPerMinute = 200;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return readingTime;
}

/**
 * Converts the given number of minutes to a date and time string in ISO format.
 *
 * @param {number} minutes - The number of minutes to add to the current date and time.
 * @return {string} The date and time string in ISO format.
 */
export function minutesToDateTime(minutes: number): string {
  const today: Date = new Date();
  today.setHours(0, 0, 0, 0);
  today.setMinutes(today.getMinutes() + minutes);

  const isoString: string = today.toISOString().slice(0, 19);
  return isoString;
}
