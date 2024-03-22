import { ReactNode } from "react";
import { Locale } from "@lib/i18n/config";

export interface IBasePageParams {
  params: {
    locale: Locale;
  };
}

export interface IBaseLayoutParams extends IBasePageParams {
  children: ReactNode;
}

export type ZoozieUserMessage = {
  status: "success" | "failure" | "warning" | "info";
  message: string;
};

export type TUser = {
  id?: number;
  emailAddress?: string;
  phoneNumber?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  isActive?: boolean;
  accessToken?: string;
  refreshToken?: string;
};
