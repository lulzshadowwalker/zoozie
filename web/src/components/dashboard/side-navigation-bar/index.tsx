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
import { useTranslations } from "next-intl";
import LinkItem from "./components/link-item";
import ButtonItem from "./components/button-item";
import { signOut } from "@/lib/actions/auth";
import SignOutButton from "./components/sign-out-button";

export default function SideNavigationBar() {
  const t = useTranslations("dashboard.side-navigation-bar");

  return (
    <nav className="fixed inset-y-0 start-0 flex w-full max-w-[8rem] flex-col overflow-y-auto border-e-[0.5px] border-gray-300 py-m-l">
      <section className="flex flex-grow-[8] flex-col justify-center gap-s-m">
        <LinkItem title={t("home")} href="/" icon={faHome} />
        <LinkItem
          title={t("listings")}
          href="/listings"
          icon={faRectangleList}
        />
        <LinkItem
          title={t("market-insights")}
          href="/market-insights"
          icon={faChartSimple}
          className="pointer-events-none"
        />
        <LinkItem
          title={t("ad-center")}
          href="/ad-center"
          icon={faBullhorn}
          className="pointer-events-none"
        />
        <LinkItem title={t("messages")} href="/messages" icon={faMessage} />
        <LinkItem
          title={t("agency-information")}
          href="/information"
          icon={faInfoCircle}
          className="pointer-events-none"
        />
      </section>

      <section className="flex flex-grow-[2] flex-col justify-center gap-s-m border-t-[0.5px] border-gray-300">
        <LinkItem
          title={t("settings")}
          href="/settings"
          icon={faCog}
          className="pointer-events-none"
        />
        <SignOutButton />
      </section>
    </nav>
  );
}
