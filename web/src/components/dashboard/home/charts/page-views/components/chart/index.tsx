"use client";

import { Locale } from "@/lib/i18n/config";
import { useLocale } from "next-intl";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

type Props = {
  data: Array<{ day: string; views: number }>;
};

export default function PageViewsChartGraph({ data }: Props) {
  const locale = useLocale() as Locale;

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      locale === "ar" ? "ar-JO" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  }

  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 10,
          bottom: 80,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
        <XAxis
          dataKey="day"
          stroke="rgb(var(--on-primary-color-1))"
          tickFormatter={formatDate}
        />
        <YAxis stroke="rgb(var(--on-primary-color-1))" />
        <Tooltip />
        <Line
          dot={false}
          type="monotone"
          dataKey="views"
          stroke="rgb(var(--on-primary-color-1))"
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
