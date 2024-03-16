import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@/lib/i18n/navigation";
import Button from "@components/shared/button";
import ZoozImage from "@components/shared/zooz-image";
import { getTranslations } from "next-intl/server";

export default async function Card() {
  const t = await getTranslations("listing-card");

  return (
    <Link
      href="/listings/foo"
      className="border rounded-xl shadow-sm p-m-l min-h-[28rem] dark:shadow-none flex flex-col gap-m-l group hover:bg-gray-100/70 md:flex-row md:justify-between"
    >
      <div className="flex-grow flex flex-row justify-between gap-3xs-2xs md:flex-col md:justify-start md:gap-0">
        <p className="text-lg text-gray-400">
          Modern Style House <br />
          <span className="font-bold text-on-primary-1">$2,500,000</span>
          <br />3 beds, 2 baths, 1,500 sqft
        </p>
        <Button
          typ="secondary"
          className="flex items-center justify-center gap-2xs-xs mt-auto md:opacity-0 transition-all md:group-hover:opacity-100"
        >
          <FontAwesomeIcon icon={faPen} />
          {t("edit")}
        </Button>
      </div>

      <div className="flex-grow relative rounded-lg overflow-hidden md:max-w-[30rem]">
        <ZoozImage
          src="https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          title=""
          fill
          sizes="(min-width: 1800px) 300px, (min-width: 1040px) calc(24.32vw - 133px), (min-width: 1000px) 300px, (min-width: 780px) calc(39vw - 82px), calc(96.96vw - 115px)"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
