"use server";

import { getTranslations } from "next-intl/server";
import { TZoozieUserMessage } from "../types";
import { cookies } from "next/headers";
import { fetchApi } from "../api";

async function toggleFavorite({
  listingId,
}: {
  listingId: number;
}): Promise<{ message?: TZoozieUserMessage; status?: boolean }> {
  const t = await getTranslations("customer.listings");
  const tToastHelpers = await getTranslations("toast-helpers");
  const unknownError: TZoozieUserMessage = {
    status: "failure",
    message: t("unknown-error"),
  };

  const accessToken = cookies().get("access-token")?.value;
  if (!accessToken) {
    console.error("toggleFavorite: no access token");
    return { message: unknownError };
  }

  try {
    const res = await fetchApi(`/listings/${listingId}/favorite`, {
      init: {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    if (!res.ok) {
      if (res.status === 403) {
        const message: TZoozieUserMessage = {
          status: "info",
          message: t("agents-cannot-interact-with-customer-functionalities"),
        };

        return { message };
      }

      console.error("toggleFavorite: unknown error", res);
      return { message: unknownError };
    }

    const favorite = (await res.json())?.data?.favorite as boolean | undefined;
    if (favorite === undefined) {
      console.error("toggleFavorite: favorite is undefined");
      return { message: unknownError };
    }

    return { status: favorite };
  } catch (e) {
    console.error("toggleFavorite: error", e);
    return { message: unknownError };
  }
}
