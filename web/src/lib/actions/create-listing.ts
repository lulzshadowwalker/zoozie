"use server";

import { getTranslations } from "next-intl/server";
import {
  CreateListingRequestPayload,
  CreateListingRequestPayloadSchema,
  TFileUpload,
  TZoozieUserMessage,
} from "../types";
import { fetchApi } from "../api";
import { cookies } from "next/headers";

export async function createListing({
  payload,
  picturesForm,
}: {
  payload: Omit<CreateListingRequestPayload, "pictures">;
  picturesForm: FormData;
}): Promise<TZoozieUserMessage> {
  const t = await getTranslations("dashboard.create-listing");
  const unknownError: TZoozieUserMessage = {
    status: "failure",
    message: t("failure"),
  };

  const accessToken = cookies().get("access-token")?.value;
  if (!accessToken) {
    console.error("createListing: no access token");
    return unknownError;
  }

  if (!picturesForm.get("files")) {
    return {
      status: "warning",
      message: t("please-add-pictures"),
    };
  }

  let pics: TFileUpload[] = [];
  try {
    const res = await fetchApi("/uploads", {
      init: {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: picturesForm,
      },
    });
    if (!res.ok) {
      console.error("createListing: pictures upload error", res.statusText);
      return unknownError;
    }

    const uploads = (await res.json())?.data?.files as
      | TFileUpload[]
      | undefined;

    if (!uploads) {
      console.error(
        "createListing: failed to upload photos. response cannot be empty.",
      );
      return unknownError;
    }

    pics = uploads;
  } catch (e) {
    console.error("failed to upload photos", e);
    return unknownError;
  }

  try {
    const validation = CreateListingRequestPayloadSchema.safeParse({
      ...payload,
      pictures: [],
    });
    // if (!validation.success) {
    //   console.error(validation.error);
    //   return {
    //     status: "warning",
    //     message: t("bad-request"),
    //   };
    // }

    const res = await fetchApi("/listings", {
      init: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...payload,
          pictures: pics.map((p) => ({
            url: p.url,
            title: p.filename,
          })),
        }),
      },
    });

    if (!res.ok) {
      console.error("createListing: error", res.statusText);
      return unknownError;
    }

    return {
      status: "success",
      message: t("listing-create-success"),
    };
  } catch (e) {
    console.error("createListing: error", e);
    return unknownError;
  }
}
