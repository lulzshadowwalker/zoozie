import { getAccessToken } from "@/lib/actions/auth";
import Card from "../card";
import { fetchApi } from "@/lib/api";
import { authenticate } from "@/lib/auth";
import { TAgencyStats } from "@/lib/types";
import { getTranslations } from "next-intl/server";

export default async function CardStats() {
  const t = await getTranslations("dashboard.home");
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.error("no access token");
    return <></>;
  }

  const claims = await authenticate(accessToken);
  const res = await fetchApi(`/agencies/${claims.agencyId}/stats`, {
    init: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
  if (!res.ok) {
    console.error("failed to fetch agency stats because ", res.statusText);
    return <></>;
  }

  const stats = (await res.json())?.data?.stats as TAgencyStats | undefined;
  if (!stats) {
    console.error("stats is not in the expected format");
    return <></>;
  }

  return (
    <section className="my-m-l grid grid-cols-2 gap-xs-s lg:grid-cols-3">
      {stats?.adminsCount !== undefined && (
        <Card title={t("admins")}>
          <p className="text-3xl font-semibold">{stats.adminsCount}</p>
        </Card>
      )}

      {stats?.listingsCount !== undefined && (
        <Card title={t("listings")}>
          <p className="text-3xl font-semibold">{stats.listingsCount}</p>
        </Card>
      )}

      {stats?.reviewsCount !== undefined && (
        <Card title={t("reviews")}>
          <p className="text-3xl font-semibold">{stats.reviewsCount}</p>
        </Card>
      )}

      {stats?.rating !== undefined && (
        <Card title={t("rating")}>
          <p className="text-3xl font-semibold">{stats.rating}</p>
        </Card>
      )}

      {stats?.conversationsCount !== undefined && (
        <Card title={t("conversations")}>
          <p className="text-3xl font-semibold">{stats.conversationsCount}</p>
        </Card>
      )}
    </section>
  );
}
