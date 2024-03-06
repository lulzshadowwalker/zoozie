import { ReactNode } from "react";
import { Locale } from "../i18n/config";

export interface BasePageParams {
  children: ReactNode;
  params: {
    locale: Locale;
  };
}
