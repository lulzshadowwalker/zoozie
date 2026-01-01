"use client";

import { shuffle } from "@/lib/utils";
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
  faSalesforce,
  faDashcube,
  faIdeal,
  faCcVisa,
  faCcMastercard,
  faStubber,
  faUnsplash,
  faTrello,
  faFly,
  faElementor,
  faUsps,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Marquee from "react-fast-marquee";

export default function Partners() {
  const t = useTranslations("customer.home");

  const samplePartnerIcons: IconProp[] = [
    faMicrosoft,
    faSpotify,
    faAmazon,
    faYahoo,
    faGoogle,
    faDigitalOcean,
    faAws,
    faStripe,
    faCcMastercard,
    faSalesforce,
    faDashcube,
    faIdeal,
    faCcVisa,
    faStubber,
    faUnsplash,
    faTrello,
    faFly,
    faElementor,
    faUsps,
  ];

  return (
    <section className="my-l-xl">
      <h2 className="text-center text-2xl font-semibold">{t("partners")}</h2>

      <div className="my-l-xl flex flex-col gap-m-l" dir="ltr">
        {[
          samplePartnerIcons.slice(0, samplePartnerIcons.length / 2),
          samplePartnerIcons.slice(samplePartnerIcons.length / 2),
        ].map((arr, index) => (
          <Marquee
            autoFill
            speed={30}
            key={index}
            direction={index % 2 === 0 ? "left" : "right"}
          >
            {arr.map((icon, index) => (
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
