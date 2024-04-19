"use server";

import { CreateAgencyFormSchema } from "@types";
import { getTranslations } from "next-intl/server";
import { fetchApi } from "../api";

export async function createAgency(
  form: FormData,
): Promise<
  [successMessage: string | undefined, errorMessage: string | undefined]
> {
  const t = await getTranslations("admin.agencies");

  const payload = {
    arabicName: form.get("arabicName"),
    englishName: form.get("englishName"),
    arabicDescription: form.get("arabicDescription"),
    englishDescription: form.get("englishDescription"),
    emailAddress: form.get("emailAddress"),
    countryCode: (form.get("countryCode") as string | undefined)?.replaceAll(
      "+",
      "",
    ),
    phoneNumber: form.get("phoneNumber"),
    logo: form.get("logo"),
  };

  // const validation = CreateAgencyFormSchema.safeParse(payload);
  // if (!validation.success) {
  //   // TODO: format a friendly possibly localized user message
  //   console.error(validation.error);
  //   return [undefined, validation.error.toString()];
  // }

  const res = await fetchApi("/agencies", {
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  });

  if (res.ok) {
    console.log("success", res.status);
    return [t("agency-created-successfully"), undefined];
  }

  console.error(res.status, res.statusText);

  return [undefined, undefined];
  // submit creation request to the backend along with all the necessary data e.g. token if any
}
