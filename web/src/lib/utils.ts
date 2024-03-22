import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";
import { ZoozieUserMessage } from "@types";
import { toast } from "react-toastify";
import { getTranslations } from "next-intl/server";

/**
 * intelligently applies your tailwind overrides and conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function showToast(
  message: ZoozieUserMessage | Promise<ZoozieUserMessage>,
) {
  toast.dismiss();
  isPromise(message)
    ? await showToastAsync(message as Promise<ZoozieUserMessage>)
    : showToastSync(message as ZoozieUserMessage);
}

export function isPromise(value: unknown): value is Promise<unknown> {
  return !!value && typeof (value as Promise<unknown>).then === "function";
}

async function showToastAsync(message: Promise<ZoozieUserMessage>) {
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

function showToastSync(message: ZoozieUserMessage): void {
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
