"use client";

import { generateApiUrl } from "@/lib/api";
import { useUser } from "@/lib/context/user";
import { useToastHelpers } from "@/lib/hooks";
import { TListing, TZoozieUserMessage } from "@/lib/types";
import { cn, showToast } from "@/lib/utils";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
  listing: TListing;
};

export default function FavoriteButton({ listing }: Props) {
  const t = useTranslations("customer.listings");
  const [favorite, setFavorite] = useState(listing.favorite);
  const { accessToken } = useUser();
  const { showAuthRequiredToast, showAgentRestrictionToast } =
    useToastHelpers();

  async function toggleFavorite() {
    if (accessToken.pending) return;
    const unknownError: TZoozieUserMessage = {
      status: "failure",
      message: t("unknown-error"),
    };

    if (!accessToken.value) {
      showAuthRequiredToast();
      return;
    }

    try {
      const listingId = listing.id;
      if (!listingId) {
        console.error("FavoriteButton: listing id is not defined");
        return;
      }

      const url = generateApiUrl({
        endpoint: `/listings/${listingId}/favorite`,
        locale: "en",
      });

      let headers: Record<string, string> = {};
      accessToken.value &&
        (headers["Authorization"] = `Bearer ${accessToken.value}`);

      const res = await fetch(url.href, {
        method: "POST",
        headers: headers,
      });

      if (!res.ok) {
        if (res.status === 403) {
          showAgentRestrictionToast();
          return;
        }

        console.error("toggleFavorite: unknown error", res);
        showToast(unknownError);
        return;
      }

      const favorite = (await res.json())?.data?.favorite as
        | boolean
        | undefined;
      if (favorite === undefined) {
        console.error("toggleFavorite: favorite is undefined");
        showToast(unknownError);
      }

      setFavorite(favorite);
    } catch (e) {
      console.error("toggleFavorite: error", e);
      showToast(unknownError);
    }
  }

  return (
    <div className="absolute end-2xs-xs top-2xs-xs flex items-center gap-3xs-2xs">
      <FontAwesomeIcon
        icon={faHeart}
        size="sm"
        className={cn(
          "rounded-full border border-gray-500 bg-primary-1/30 p-3xs-2xs text-sm text-gray-600 backdrop-blur-md transition-all",
          {
            "opacity-0 group-hover:opacity-100": !favorite,
          },
          {
            "border-red-500 bg-red-200/30 text-red-500": favorite,
          },
        )}
        onClick={toggleFavorite}
      />
    </div>
  );
}
