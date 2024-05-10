import { PostHog } from "posthog-node";
import Config from "../config";

export default function PostHogClient() {
  const posthogClient = new PostHog(Config.postHogKey, {
    host: Config.postHogHost,
  });

  return posthogClient;
}
