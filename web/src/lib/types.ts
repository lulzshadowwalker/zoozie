import { ReactNode } from "react";
import { Locale } from "@lib/i18n/config";
import { z } from "zod";

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

export type TCoreFeature = {
  name?: string;
  description?: string;
  icon?: string;
  required?: boolean;
  dataType?: "text" | "number";
};

export const CreateAgencyFormSchema = z.object({
  englishName: z.string(),
  arabicName: z.string(),
  arabicDescription: z.string(),
  englishDescription: z.string(),
  emailAddress: z.string().email(),
  countryCode: z.number().min(1).max(3),
  phoneNumber: z.number().max(12),
  logo: z.string().url(),
});

export type TCreateAgencyForm = z.infer<typeof CreateAgencyFormSchema>;

export const RegisterCustomerFormSchema = z.object({
  name: z.string(),
  countryCode: z.number().min(1).max(999),
  phoneNumber: z.number().max(999999999999),
  email: z.string().email().nullable(),
});

export type TRegisterCustomerForm = z.infer<typeof RegisterCustomerFormSchema>;

export type TPhoneNumber = {
  countryCode: string;
  phoneNumber: string;
};
