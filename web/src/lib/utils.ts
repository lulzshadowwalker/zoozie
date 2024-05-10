import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";
import { TZoozieUserMessage } from "@types";
import { StoreApi, UseBoundStore } from "zustand";
import { toast } from "react-toastify";
import { getTranslations } from "next-intl/server";
import { Locale } from "./i18n/config";
import path from "path";
import Config from "./config";
import { agencyFallbackImage, customerFallbackImage } from "./constants";

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
 * Retrieves the customer image based on the provided image or fallback to a default image.
 *
 * @param {string | undefined} image - The image URL to retrieve or undefined.
 * @return {string} The customer image URL.
 */
export function getCustomerImage(image: string | undefined): string {
  return image ?? customerFallbackImage;
}

/**
 * Retrieves the agency image based on the provided image or fallback to a default image.
 *
 * @param {string | undefined} image - The image URL to retrieve or undefined.
 * @return {string} The agency image URL.
 */
export function getAgencyImage(image: string | undefined): string {
  return image ?? agencyFallbackImage;
}

export function isEmptyObject(obj: any): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}
