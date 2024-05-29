import { cn } from "@/lib/utils";
import Card from "../../card";
import { TPostHogTrendsQueryResult } from "@/lib/types";
import PageViewsChartGraph from "./components/chart";
import { getTranslations } from "next-intl/server";
import Config from "@/lib/config";
import { randomUUID } from "crypto";

type Props = {
  className?: string;
  agency: string;
};

export default async function PageViewsChart({
  agency: slug,
  className,
}: Props) {
  const t = await getTranslations("dashboard.home");

  const res = await fetch("https://app.posthog.com/api/projects/68109/query/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Config.postHogApiKey}`,
    },
    body: JSON.stringify({
      query: {
        kind: "TrendsQuery",
        dateRange: {
          date_from: "-30dStart",
          date_to: "-1dEnd",
        },
        interval: "day",
        series: [
          {
            event: "$pageview",
            kind: "EventsNode",
            math: "dau",
            name: "$pageview",
            custom_name: "Unique visitors",
          },
        ],
        filterTestAccounts: true,
        properties: [
          {
            key: "agency.slug",
            value: [slug],
            operator: "exact",
            type: "event",
          },
        ],
      },
      client_query_id: randomUUID(),
      refresh: false,
      async: false,
    }),
  });

  if (!res.ok) {
    console.error("failed to fetch users chart data because ", res.statusText);
    return <></>;
  }

  const result = (await res.json())?.results?.[0] as
    | TPostHogTrendsQueryResult
    | undefined;
  if (!result) {
    console.error("result is not in the expected format");
    return <></>;
  }

  if (result.data.length !== result.days.length) {
    console.error("data and days are expected to be the same length");
    return <></>;
  }

  const chartData = result?.data.map((value, index) => ({
    day: result.days[index],
    views: value,
  }));

  return (
    <Card
      title={t("page-views")}
      subtitle={t("past-30-days")}
      className={cn("h-[42rem] w-full", className)}
    >
      <PageViewsChartGraph data={chartData} />
    </Card>
  );
}
