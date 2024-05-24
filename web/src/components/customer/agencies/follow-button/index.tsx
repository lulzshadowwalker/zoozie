"use client";

import Button from "@/components/shared/button";
import { generateApiUrl } from "@/lib/api";
import { useUser } from "@/lib/context/user";
import { useToastHelpers } from "@/lib/hooks";
import { Locale } from "@/lib/i18n/config";
import { TAgency, TZoozieUserMessage } from "@/lib/types";
import { cn, showToast } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { ButtonHTMLAttributes, useEffect, useState } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  slug: string;
}

export default function FollowButton({
  slug,
  className,
  onClick,
  ...rest
}: Props) {
  const t = useTranslations("customer.agency");
  const [following, setFollowing] = useState<boolean>(false);
  const [agency, setAgency] = useState<TAgency>();
  const { accessToken } = useUser();
  const { showAuthRequiredToast } = useToastHelpers();
  const locale = useLocale() as Locale;

  useEffect(() => {
    if (accessToken.pending) return;
    fetchAgency().then((agency) => {
      if (!agency) return;
      setAgency(agency);

      if (agency.following === undefined || agency.following === null) {
        console.error("FollowButton: response is not in the expected format");
        return;
      }

      setFollowing(agency.following);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken.value, accessToken.pending]);

  async function toggleFollow() {
    const unknownError: TZoozieUserMessage = {
      status: "failure",
      message: t("something-went-wrong"),
    };

    if (!accessToken.value) {
      showAuthRequiredToast();
      return;
    }

    if (!agency?.id) {
      console.error("FollowButton: agency id is not defined");
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
              message: t("agents-cannot-follow"),
            });
            return;
          default:
            showToast(unknownError);
            console.error("failed to toggle favorite because ", res.statusText);
            return;
        }
      }

      const following = (await res.json())?.data?.following as
        | boolean
        | undefined;

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

  async function fetchAgency() {
    try {
      const headers: Record<string, string> = {};
      accessToken.value &&
        (headers.Authorization = `Bearer ${accessToken.value}`);

      const url = generateApiUrl({
        endpoint: "/agencies",
        locale,
        queryParams: { slug },
      });

      const res = await fetch(url.href, {
        headers,
        cache: "no-store",
      });
      if (!res.ok) {
        console.error(
          "FollowAgencyButton: failed to fetch agency because",
          res.statusText,
        );
        return;
      }

      const agency = (await res.json())?.data?.agency as TAgency | undefined;
      if (!agency) {
        console.error(
          "FollowAgencyButton: agency is not in the expected format",
        );
        return;
      }

      return agency;
    } catch (e) {
      console.error("Failed to fetch agency because ", e);
    }
  }

  if (!agency) {
    return <></>;
  }

  return (
    <Button
      typ="secondary"
      className={cn(
        "relative ms-0 min-w-fit flex-grow basis-0 py-xs-s transition-all md:flex-grow-0 md:py-3xs-2xs",
        className,
      )}
      onClick={(e) => {
        toggleFollow();

        if (onClick) {
          onClick(e);
        }
      }}
      {...rest}
    >
      {following ? t("unfollow") : t("follow")}
    </Button>
  );
}
