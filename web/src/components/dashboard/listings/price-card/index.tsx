import Button from "@/components/shared/button";
import { faMobile } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTranslations } from "next-intl/server";
import Price from "./components/price";

export default async function PriceCard() {
  const t = await getTranslations("dashboard.create-listing");

  return (
    <div className="top-[3rem] mt-l-xl w-full rounded-2xl border border-gray-400 bg-gray-300/20 px-s-m py-m-l lg:sticky lg:max-w-[34rem]">
      <Price />

      <article>
        <h2 className="text-xl font-medium">{t("contact-information")}</h2>
        <ul className="mt-xs-s flex flex-col gap-2xs-xs">
          <li className="flex items-center gap-3xs-2xs">
            <FontAwesomeIcon icon={faEnvelope} />
            <a
              href="mailto:email@example.com"
              className="text-lg font-light text-gray-600"
            >
              email@example.com
            </a>
          </li>

          <li className="flex items-center gap-3xs-2xs">
            <FontAwesomeIcon icon={faMobile} />
            <a
              href="tel:07912345678"
              className="text-lg font-light text-gray-600"
            >
              079 982 0981
            </a>
          </li>
        </ul>
      </article>

      <Button className="mt-xl-2xl w-full py-xs-s lg:py-3xs-2xs">
        {t("message")}
      </Button>
    </div>
  );
}
