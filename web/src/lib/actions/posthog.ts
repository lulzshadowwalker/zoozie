"use server";
import { cookies } from "next/headers";
import { getUser } from "./auth";
import { randomUUID } from "crypto";

const postHogDistinctIdCookieKey =
  // By default, this cookie is set to expire after 365 days and is named with your Project API key e.g. ph_<project_api_key>_posthog.
  "ph_phc_GYY4vzTtTkQuLVKL4YyIA3lXAni6NXEFtDaLmfYWibq_posthog";

/**
 * Retrieves the distinct ID for PostHog.
 *
 * @return {Promise<string>} The distinct ID for PostHog.
 */
export async function getPostHogDistinctId() {
  const user = await getUser().then((res) => res?.user);
  if (user) {
    if (user?.emailAddress) {
      return user.emailAddress;
    }

    console.error(
      "authenticated user with id " +
        user.id +
        " does not have an associated email address",
    );
  }

  let pookie = cookies().get(postHogDistinctIdCookieKey)?.value;
  if (pookie) {
    try {
      return JSON.parse(pookie).distinct_id;
    } catch (e) {
      console.error("failed to parse posthog cookie", e);
    }
  }

  console.error("posthog distinct id not found in cookie");
  return randomUUID();
}
