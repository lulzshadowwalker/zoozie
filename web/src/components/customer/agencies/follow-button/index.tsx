"use client";

import Button from "@/components/shared/button";
import { generateApiUrl } from "@/lib/api";
import { useUser } from "@/lib/context/user";
import { useToastHelpers } from "@/lib/hooks";
import { TAgency, TZoozieUserMessage } from "@/lib/types";
import { showToast } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
  agency: TAgency;
};

export default function FollowButton({ agency }: Props) {
  const t = useTranslations("customer.agency");
  const [following, setFollowing] = useState<boolean>(
    agency.following ?? false,
  );
  const { accessToken } = useUser();
  const { showAuthRequiredToast } = useToastHelpers();

  async function toggleFollow() {
    const unknownError: TZoozieUserMessage = {
      status: "failure",
      message: t("something-went-wrong"),
    };

    if (!accessToken.value) {
      showAuthRequiredToast();
      return;
    }

    try {
      const url = generateApiUrl({
        endpoint: `/agencies/${agency.id}/follows`,
        locale: "en",
      });

      const res = await fetch(url.href, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken.value}` },
      });

      if (!res.ok) {
        switch (res.status) {
          case 403:
            showToast({
              status: "warning",
              message: t("agency-cannot-follow"),
            });
            return;
          default:
            showToast(unknownError);
            console.error("failed to toggle favorite because ", res.statusText);
            return;
        }
      }

      const data = await res.json();
      console.table(data);
      const following = data?.data?.following as boolean | undefined;

      if (following === undefined) {
        console.error("FollowButton: response is not in the expected format");
        return;
      }

      setFollowing(following);
    } catch (e) {
      console.error(e);
      showToast(unknownError);
    }
  }

  return (
    <Button
      typ="secondary"
      className="ms-0 flex-grow basis-0 py-xs-s md:flex-grow-0 md:py-3xs-2xs"
      onClick={toggleFollow}
    >
      {following ? t("unfollow") : t("follow")}
    </Button>
  );
}
