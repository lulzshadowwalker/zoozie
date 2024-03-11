import ZoozImage from "@/components/shared/zooz-image";
import {
  faLocationDot,
  faBed,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import Listings from "@/components/shared/listings";

// TODO: refactor out the listings items grid
export default function FeaturedListings() {
  const t = useTranslations("home");

  return (
    <section className="my-l-xl max-w-page px-page mx-auto">
      <article>
        <h2 className="text-2xl font-semibold">{t("featured-listings")}</h2>

        <Listings />

        <Link
          href="/listings"
          className="inline-block text-end w-full mt-xs-s underline underline-offset-4 outline-none hover:decoration-transparent focus:decoration-transparent"
        >
          {t("view-more")}{" "}
          <FontAwesomeIcon icon={faArrowRight} className="rtl:rotate-180" />
        </Link>
      </article>
    </section>
  );
}
