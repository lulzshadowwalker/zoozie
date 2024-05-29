import { PostHog } from "posthog-node";
import Config from "../config";

/**
 * Posthog client for the server-side.
 */
export default function PostHogClient() {
  const posthogClient = new PostHog(Config.postHogKey, {
    host: Config.postHogHost,

    // Note: Because our server-side posthog-node initializations are short-lived,
    // we set flushAt to 1 and flushInterval to 0.
    // flushAt sets how many capture calls we should flush the queue (in one batch). 
    // flushInterval sets how many milliseconds we should wait before flushing the queue.
    // Setting them to the lowest number ensures events are sent immediately and not batched. We also need to call await posthog.shutdown() once done.
    flushAt: 1,
    flushInterval: 0,
  });

  return posthogClient;
}
