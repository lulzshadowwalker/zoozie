import { IBasePageParams } from "@/lib/types";
import { unstable_setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const Forbidden = dynamic(() => import("./_page"), { ssr: false });

export default function ForbiddenWrapper({
  params: { locale },
}: IBasePageParams) {
  unstable_setRequestLocale(locale);
  return <Forbidden />;
}
