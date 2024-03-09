"use client";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faMicrosoft,
  faSpotify,
  faAmazon,
  faYahoo,
  faGoogle,
  faDigitalOcean,
  faAws,
  faStripe,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Marquee from "react-fast-marquee";

export default function Partners() {
  const t = useTranslations("home");

  const samplePartnerIcons: IconProp[] = [
    faMicrosoft,
    faSpotify,
    faAmazon,
    faYahoo,
    faGoogle,
    faDigitalOcean,
    faAws,
    faStripe,
  ];

  return (
    <section className="my-l-xl">
      <h2 className="text-2xl font-semibold text-center">{t("partners")}</h2>

      <div className="flex flex-col gap-m-l my-l-xl">
        {[...Array(2)].map((_, index) => (
          <Marquee
            autoFill
            speed={30}
            key={index}
            direction={index % 2 === 0 ? "left" : "right"}
          >
            {samplePartnerIcons.map((icon, index) => (
              <FontAwesomeIcon
                icon={icon}
                key={index}
                className="mx-m-l text-gray-300 transition-all hover:text-on-primary-1"
                size="7x"
              />
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
