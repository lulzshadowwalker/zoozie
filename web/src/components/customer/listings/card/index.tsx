import { Link } from "@/lib/i18n/navigation";
import ZoozImage from "@components/shared/zooz-image";

export default function Card() {
  return (
    <Link
      href="/listings/foo"
      className="border rounded-xl shadow-sm p-m-l min-h-[28rem] dark:shadow-none flex flex-col gap-m-l group hover:bg-gray-100/70 !outline-none md:flex-row md:justify-between"
    >
      <div className="flex flex-row justify-between gap-3xs-2xs">
        <p className="text-lg text-gray-400">
          Modern Style House <br />
          <span className="font-bold text-on-primary-1">$2,500,000</span>
          <br />3 beds, 2 baths, 1,500 sqft
        </p>
      </div>

      <div className="flex-grow relative rounded-lg overflow-hidden md:max-w-[30rem]">
        <ZoozImage
          src="https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          title=""
          fill
          sizes="(min-width: 780px) 300px, calc(90.65vw - 91px)"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
