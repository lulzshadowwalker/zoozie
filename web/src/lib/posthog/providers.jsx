"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import Config from "../config";

if (typeof window !== "undefined") {
  posthog.init(Config.postHogKey, { api_host: Config.postHogHost });
}

export default function ClientSidePostHogProvider({ children }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
