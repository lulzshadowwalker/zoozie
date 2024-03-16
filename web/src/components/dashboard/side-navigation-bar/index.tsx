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

export default function SideNavigationBar() {
  return (
    <nav className="fixed inset-y-0 start-0 py-m-l border-e-[0.5px] border-gray-300 max-w-[8rem] w-full flex flex-col">
      <section className="flex-grow-[8] flex flex-col justify-center gap-s-m">
        <Item href="/" icon={faHome} />
        <Item href="/listings" icon={faRectangleList} />
        <Item href="/market-insights" icon={faChartSimple} />
        <Item href="/ad-center" icon={faBullhorn} />
        <Item href="/messages" icon={faMessage} />
        <Item href="/information" icon={faInfoCircle} />
      </section>

      <section className="flex-grow-[2] flex flex-col justify-center gap-s-m border-t-[0.5px] border-gray-300">
        <Item href="/settings" icon={faCog} />

        {/* TODO: probably might wanna make this a standalone component with differnt styling even  */}
        <Item href="/sign-out" icon={faRightFromBracket} />
      </section>
    </nav>
  );
}
