import {
  faBullhorn,
  faChartSimple,
  faCog,
  faHome,
  faInfoCircle,
  faMessage,
  faRectangleList,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Item from "./components/item";
import { useTranslations } from "next-intl";

export default function SideNavigationBar() {
  const t = useTranslations("dashboard.side-navigation-bar");

  return (
    <nav className="fixed inset-y-0 start-0 py-m-l border-e-[0.5px] border-gray-300 max-w-[8rem] w-full flex flex-col">
      <section className="flex-grow-[8] flex flex-col justify-center gap-s-m">
        <Item title={t("home")} href="/" icon={faHome} />
        <Item title={t("listings")} href="/listings" icon={faRectangleList} />
        <Item title={t("market-insights")} href="/market-insights" icon={faChartSimple} />
        <Item title={t("ad-center")} href="/ad-center" icon={faBullhorn} />
        <Item title={t("messages")} href="/messages" icon={faMessage} />
        <Item title={t("agency-information")} href="/information" icon={faInfoCircle} />
      </section>

      <section className="flex-grow-[2] flex flex-col justify-center gap-s-m border-t-[0.5px] border-gray-300">
        <Item title={t("settings")} href="/settings" icon={faCog} />

        {/* TODO: probably might wanna make this a standalone component with differnt styling even  */}
        <Item title={t("sign-out")} href="/sign-out" icon={faRightFromBracket} />
      </section>
    </nav>
  );
}
