"use client";

import { useCurrentUrl } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import {
  faFacebookSquare,
  faLinkedin,
  faTelegram,
  faTwitter,
  faWhatsappSquare,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { HTMLAttributes } from "react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

export default function SocialLinks({
  className,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  const t = useTranslations("customer.blog");
  const { url } = useCurrentUrl();

  return (
    <aside className={cn("flex gap-3xs-2xs", className)} {...rest}>
      <FacebookShareButton url={url}>
        <FontAwesomeIcon
          icon={faFacebookSquare}
          size="3x"
          title={t("share-on-facebook")}
          className="text-[#1877F2]"
        />
      </FacebookShareButton>

      <LinkedinShareButton url={url}>
        <FontAwesomeIcon
          icon={faLinkedin}
          size="3x"
          title={t("share-on-linkedin")}
          className="text-[#0072b1]"
        />
      </LinkedinShareButton>

      <TwitterShareButton
        url={url}
        className="Demo__some-network__share-button"
      >
        <FontAwesomeIcon
          icon={faTwitter}
          size="3x"
          title={t("share-on-twitter")}
          className="text-[#1DA1F2]"
        />
      </TwitterShareButton>

      <WhatsappShareButton url={url}>
        <FontAwesomeIcon
          icon={faWhatsappSquare}
          size="3x"
          title={t("share-on-whatsapp")}
          className="text-[#25D366]"
        />
      </WhatsappShareButton>
      {/* <TelegramShareButton url={url}>
        <FontAwesomeIcon
          icon={faTelegram}
          size="3x"
          title={t("share-on-telegram")}
          className="text-[#24A1DE]"
        />
      </TelegramShareButton> */}
    </aside>
  );
}
