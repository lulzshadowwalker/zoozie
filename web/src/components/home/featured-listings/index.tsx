import ZoozImage from "@/components/shared/zooz-image";
import {
  faLocationDot,
  faBed,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

// TODO: refactor out the listings items grid
export default function FeaturedListings() {
  const t = useTranslations("home");

  const sampleImages: string[] = [
    "https://images.unsplash.com/photo-1551429340-1a7a56cde81f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1612200167908-f55e26ada541?q=80&w=2866&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1434873740857-1bc5653afda8?q=80&w=2900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <section className="my-l-xl max-w-page px-page mx-auto">
      <article>
        <h2 className="text-2xl font-semibold">{t("featured-listings")}</h2>

        <ul className="grid grid-cols-[repeat(auto-fit,minmax(25.5rem,16rem))] gap-3xs-2xs sm:place-content-start place-content-start mt-s-m max-[622px]:grid-cols-1">
          {[...sampleImages, ...sampleImages.reverse()].map((image, index) => (
            <li
              key={index}
              className="relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md dark:shadow-none"
            >
              <Link href="/listings/foo" className="group">
                <ZoozImage
                  src={image}
                  alt=""
                  title=""
                  fill
                  sizes="(min-width: 640px) 255px, calc(92.81vw - 64px)"
                  className="object-cover transition-all duration-[800ms] ease-out hover:scale-105 group-focus:scale-110"
                  quality={75}
                />

                <div className="bg-primary-1/60 backdrop-blur-md min-h-[7rem] w-full absolute bottom-0 px-s-m py-2xs-xs flex flex-col justify-center gap-3xs-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3xs-2xs">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-gray-600"
                      />
                      <span className="text-lg font-semibold">Abdoun</span>
                    </div>

                    <p className="text-lg">
                      <strong className="font-medium">20,500</strong>
                      <span className="text-base">JOD</span>
                    </p>
                  </div>

                  <div className="flex justify-start space-x-xs-s">
                    {[...Array(3)].map((_, index) => (
                      <div
                        className="flex items-center gap-3xs-2xs"
                        key={index}
                      >
                        <FontAwesomeIcon
                          icon={faBed}
                          size="sm"
                          className="text-gray-500"
                        />
                        <span className="text-base font-semibold">5</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

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
