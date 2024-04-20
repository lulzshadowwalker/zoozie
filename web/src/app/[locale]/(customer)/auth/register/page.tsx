import { unstable_setRequestLocale } from "next-intl/server";
import Login from "./_page";
import { IBasePageParams } from "@types";

export default function RegisterWrapper({
  params: { locale },
}: IBasePageParams) {
  unstable_setRequestLocale(locale);
  return <Login />;
}
