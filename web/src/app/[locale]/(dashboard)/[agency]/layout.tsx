import { IBaseLayoutParams } from "@types";
import { unstable_setRequestLocale } from "next-intl/server";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    {
      agency: "lulzie",
    },
  ];
}

export default function DashboardAgencyLayout({
  params: { locale },
  children,
}: IBaseLayoutParams) {
  unstable_setRequestLocale(locale);
  return children;
}
