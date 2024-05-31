import { cn } from "@/lib/utils";
import Card from "../../card";
import { TAgency, TAgencyReview, TPostHogTrendsQueryResult } from "@/lib/types";
import RatingsChartGraph from "./components/chart";
import { getTranslations } from "next-intl/server";
import Config from "@/lib/config";
import { randomUUID } from "crypto";
import { fetchApi } from "@/lib/api";
import result from "postcss/lib/result";
import { startOfDay } from "date-fns";

type Props = {
  className?: string;
  agency: TAgency;
};

export default async function RatingsChart({ agency, className }: Props) {
  const t = await getTranslations("dashboard.home");

  const res = await fetchApi(`/agencies/${agency.id}/reviews`, {
    init: { cache: "no-store" },
  });

  if (!res.ok) {
    console.error(
      "failed to fetch reviews for agency %f because %s",
      agency.id,
      res.statusText,
    );
    return <></>;
  }

  const reviews = (await res.json())?.data?.reviews as
    | TAgencyReview[]
    | undefined;

  if (!reviews) {
    console.error("agency reviews response is not in the expected format");
    return <></>;
  }

  const aggregatedData: Record<string, { total: number; count: number }> = {};

  reviews?.forEach((review: TAgencyReview) => {
    if (!review.createdAt) {
      console.error("review is missing a createdAt field");
      return;
    }

    const day = startOfDay(new Date(review.createdAt)).toISOString();

    if (!review.rating) {
      console.error("review is missing a rating field");
      return;
    }

    if (aggregatedData[day]) {
      aggregatedData[day].total += review.rating;
      aggregatedData[day].count += 1;
    } else {
      aggregatedData[day] = {
        total: review.rating,
        count: 1,
      };
    }
  });

  const chartData = Object.entries(aggregatedData)
    .map(([day, { total, count }]) => ({
      day: new Date(day),
      rating: total / count,
    }))
    .sort((a, b) => a.day.getTime() - b.day.getTime());

  return (
    <Card
      title={t("ratings")}
      subtitle={t("all-time")}
      className={cn("h-[42rem] w-full", className)}
    >
      {/* TODO: remove any */}
      <RatingsChartGraph data={chartData as any} />
    </Card>
  );
}
