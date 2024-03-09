import { ReactNode } from "react";
import { Locale } from "../i18n/config";

export interface IBasePageParams {
  params: {
    locale: Locale;
  };
}

export interface IBaseLayoutParams extends IBasePageParams {
  children: ReactNode;
}
