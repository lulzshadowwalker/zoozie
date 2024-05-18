import { ReactNode } from "react";
import { Locale } from "@lib/i18n/config";
import { z } from "zod";
import { listingTypes } from "./const";

export interface IBasePageParams {
  params: {
    locale: Locale;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export interface IBaseAgencyParams extends Omit<IBasePageParams, "params"> {
  params: {
    locale: Locale;
    agency: string;
  };
}

export interface IBaseLayoutParams {
  params: {
    locale: Locale;
  };
  children: ReactNode;
}

export interface IBaseAgencyLayoutParams {
  params: {
    locale: Locale;
    agency: string;
  };
  children: ReactNode;
}

export type TZoozieUserMessage = {
  status: "success" | "failure" | "warning" | "info";
  message: string;
};

export type TUserRole = "CUSTOMER" | "AGENCY_AGENT" | "ZOOZIE_ADMIN";

export type TAgencyAgent = {
  id?: number;
  userId?: number;
  agencyId?: number;
  agency?: TAgency;
};

export type TUser = {
  id?: number;
  name?: string;
  emailAddress?: string;
  phoneNumber?: string;
  profilePicture?: string | null;
  role?: TUserRole;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  isActive?: boolean;
  accessToken?: string;
  refreshToken?: string;
  agent?: TAgencyAgent;
  customer?: TCustomer;
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

export type TLocation = {
  country?: TCountry;
  city?: TCity;
  area?: TArea;
};

export type TCountry = {
  id?: number;
  name?: string;
  code?: string;
};

export type TCity = {
  id?: number;
  name?: string;
};

export type TArea = {
  id?: number;
  name?: string;
};

export type TListingType = {
  name?: string;
  code?: string;
};

export const CreateListingRequestPayloadSchema = z.object({
  descriptionEnglish: z.string(),
  descriptionArabic: z.string(),
  bedrooms: z.number(),
  type: z.string(),
  bedroomsDescriptionEnglish: z.string().nullable(),
  bedroomsDescriptionArabic: z.string().nullable(),
  bathrooms: z.number(),
  bathroomsDescriptionEnglish: z.string().nullable(),
  bathroomsDescriptionArabic: z.string().nullable(),
  yearBuilt: z.number(),
  yearBuiltDescriptionEnglish: z.string().nullable(),
  yearBuiltDescriptionArabic: z.string().nullable(),
  area: z.number(),
  areaDescriptionEnglish: z.string().nullable(),
  areaDescriptionArabic: z.string().nullable(),
  furnished: z.boolean(),
  furnishedDescriptionEnglish: z.string().nullable(),
  furnishedDescriptionArabic: z.string().nullable(),
  extraFeatures: z.array(
    z.object({
      titleEnglish: z.string(),
      titleArabic: z.string(),
      exists: z.boolean(),
    }),
  ),
  availabilities: z.array(
    z.object({
      availability: z.string().regex(/^(RENT|SALE)$/),
      price: z.object({
        currency: z.string().regex(/^(USD|JOD)$/),
        amount: z.number(),
      }),
    }),
  ),
  pictures: z.array(
    z.object({
      url: z.string().url(),
      title: z.string().nullable(),
    }),
  ),
  location: z.object({
    countryId: z.number(),
    cityId: z.number(),
    areaId: z.number(),
  }),
});

export type CreateListingRequestPayload = z.infer<
  typeof CreateListingRequestPayloadSchema
>;

export type TFileUpload = {
  id?: number;
  filename?: string;
  fileType?: string;
  url?: string;
};

export type TListing = {
  id?: number;
  type?: string;
  description?: string;
  agencyId?: number;
  agency?: TAgency;
  extraFeatures?: Array<{
    id?: number;
    title?: string;
    available?: boolean;
  }>;
  pictures?: Array<{
    id?: number;
    title?: string;
    url?: string;
    highlighted?: boolean;
  }>;
  availabilities?: Array<{
    availability?: "SALE" | "RENT";
    price?: {
      amount?: number;
      currency?: string;
    };
  }>;
  location?: {
    country?: {
      name?: string;
    };
    city?: {
      name?: string;
    };
    area?: {
      name?: string;
    };
  };
  property?: {
    bedrooms?: {
      value?: number;
      description?: string;
    };
    bathrooms?: {
      value?: number;
      description?: string;
    };
    area?: {
      value?: number;
      description?: string;
    };
    furnished?: {
      value?: boolean;
      description?: string;
    };
    yearBuilt?: {
      value?: number;
      description?: string;
    };
  };
  favorite?: boolean;
  slug?: string;
};

export type TAgency = {
  id?: number;
  phoneNumber?: {
    countryCode?: string;
    phoneNumber?: string;
  };
  emailAddress?: string;
  logo?: string;
  slug?: string;
  name?: string;
  description?: string;
  following?: boolean;
  rating?: number;
  reviewsCount?: number;
};

export type TCustomer = TUser & { customer?: { id?: number; userId?: number } };

export type TConversationMessage = {
  id?: number;
  conversationId?: number;
  sentAt?: string;
  sender?: TSenderType;
  type?: TMessageType;
  content?: string;
};

export type TConversation = {
  id?: number;
  customerId?: number;
  agencyId?: number;
  createdAt?: string;
  updatedAt?: string;
  customer?: TCustomer;
  agency?: TAgency;
  messages?: Array<TConversationMessage>;
  latestMessage?: TConversationMessage;
};

export type TMessageType = "TEXT";
export type TSenderType = "AGENCY" | "CUSTOMER";

export type TSocketMessage = {
  message?: {
    type?: TMessageType;
    sender?: TSenderType;
    content?: string;
    SentAt?: string;
  };
  error?: TSocketError;
};

export type TSocketError = {
  code?:
    | "SEND_FAILURE"
    | "READ_FAILURE"
    | "INTERNAL_FAILURE"
    | "UNRECOGNIZED_MESSAGE_TYPE"
    | "UNAUTHENTICATED"
    | "INVALID_TOKEN";
  message?: string;
};

export type TListingFilters = {
  minBedrooms?: number;
  minBathrooms?: number;
  minYear?: number;
  minArea?: number;
  availability?: "RENT" | "SALE";
  minRentPrice?: number;
  maxRentPrice?: number;
  minSalePrice?: number;
  maxSalePrice?: number;
  type?: (typeof listingTypes)[number];
};

export type TAgencyReview = {
  id?: number;
  agencyId?: number;
  customerId?: number;
  customer?: Omit<TUser, "accessToken" | "refreshToken">;
  content?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  createdAt?: string;
  updatedAt?: string;
};
