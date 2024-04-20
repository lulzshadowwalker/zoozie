"use server";

import { fetchApi } from "@/lib/api";
import { RegisterCustomerFormSchema, TUser, ZoozieUserMessage } from "../types";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export async function login(
  initialState: ZoozieUserMessage | undefined,
  form: FormData,
): Promise<ZoozieUserMessage> {
  const t = await getTranslations("customer.auth");

  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const res = await fetchApi("/auth/login", {
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    },
  });

  const unknownError: ZoozieUserMessage = {
    status: "failure",
    message: t("failure"),
  };

  if (!res.ok) {
    let message: ZoozieUserMessage | undefined;
    switch (res.status) {
      case 403:
        message = {
          status: "failure",
          message: t("user-deactivated"),
        };
        break;
      case 401:
        message = {
          status: "failure",
          message: t("invalid-credentials"),
        };
        break;
      case 400:
      default:
        console.error("actions.login: status ", res.status);
        message = unknownError;
    }

    return message;
  }

  const user = (await res.json())?.data as TUser | undefined;
  if (!user || !user.accessToken || !user.refreshToken) {
    console.error("invalid api user response");
    return unknownError;
  }

  updateCookies(user.accessToken, user.refreshToken);

  return {
    status: "success",
    message: t("success"),
  };
}

export async function registerCustomer(
  initialState: ZoozieUserMessage | undefined,
  form: FormData,
): Promise<ZoozieUserMessage> {
  const t = await getTranslations("customer.auth");

  const payload = {
    name: form.get("name"),
    countryCode: Number(form.get("countryCode")),
    phoneNumber: Number(form.get("phoneNumber")),
    email: form.get("emailAddress"),
    profilePicture: form.get("profilePicture"),
  };

  const validation = RegisterCustomerFormSchema.safeParse(payload);
  const profilePicture = payload.profilePicture;
  if (
    !validation.success ||
    (profilePicture && !(profilePicture instanceof File))
  ) {
    return {
      status: "failure",
      message: t("bad-request"),
    };
  }

  const res = await fetchApi("/auth/register/customer", {
    init: {
      method: "POST",
      body: form,
    },
  });

  const unknownError: ZoozieUserMessage = {
    status: "failure",
    message: t("failure"),
  };

  if (!res.ok) {
    let message: ZoozieUserMessage | undefined;
    switch (res.status) {
      case 400:
      default:
        console.error("actions.registerCustomer: status ", res.status);
        const msg = (await res.json())?.message;
        console.log(msg);
        message = unknownError;
    }

    return message;
  }

  const r = (await res.json()) as TRegisterCustomerResponsePayload | undefined;
  const user = r?.data?.user;
  if (!r || !user?.accessToken || !user?.refreshToken) {
    console.error("invalid api user response");
    return unknownError;
  }

  updateCookies(user.accessToken, user.refreshToken);

  return {
    status: "success",
    message: t("customer-register-success"),
  };
}

export async function sendOtp(): Promise<ZoozieUserMessage> {
  const t = await getTranslations("customer.auth");
  const unknownError: ZoozieUserMessage = {
    status: "failure",
    message: t("otp-sent-failure"),
  };

  const accessToken = cookies().get("access-token")?.value;
  if (!accessToken) {
    console.error("sendOtp: no access token");
    return unknownError;
  }

  const res = await fetchApi("/auth/otp/send", {
    init: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  if (!res.ok) {
    switch (res.status) {
      default:
        console.error("actions.sendOtp: status ", res.status);
        return unknownError;
    }
  }

  return {
    status: "success",
    message: t("otp-sent-successfully"),
  };
}

export async function verifyOtp(
  initialState: ZoozieUserMessage | undefined,
  form: FormData,
): Promise<ZoozieUserMessage> {
  const t = await getTranslations("customer.auth");
  const unknownError: ZoozieUserMessage = {
    status: "failure",
    message: t("failure"),
  };

  const accessToken = cookies().get("access-token")?.value;
  if (!accessToken) {
    console.error("verifyOtp: no access token");
    return unknownError;
  }

  const prompt = form.get("otp");
  if (!prompt) {
    return {
      status: "warning",
      message: t("bad-request"),
    };
  }

  const res = await fetchApi("/auth/otp/verify", {
    init: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    },
  });

  if (!res.ok) {
    switch (res.status) {
      // otp expired
      case 403:
        return {
          status: "warning",
          message: t("otp-expired"),
        };

      //invalid otp
      case 401:
        return {
          status: "failure",
          message: t("otp-invalid"),
        };

      default:
        console.error("actions.verifyOtp: status ", res.status);
        return unknownError;
    }
  }

  return {
    status: "success",
    message: t("otp-verified-successfully"),
  };
}

export async function getUser(): Promise<
  { user?: TUser; message?: ZoozieUserMessage } | undefined
> {
  const t = await getTranslations("customer.auth");
  const accessToken = cookies().get("access-token")?.value;
  if (!accessToken) {
    return undefined;
  }

  const maxRetries = 1;
  const { user, message } = await fetchUser(accessToken, maxRetries);

  delete user?.accessToken;
  delete user?.refreshToken;
  return { user, message };
}

async function fetchUser(
  accessToken: string,
  retries: number,
): Promise<{ user?: TUser; message?: ZoozieUserMessage }> {
  const t = await getTranslations("customer.auth");
  const unknownError: ZoozieUserMessage = {
    status: "failure",
    message: t("failure"),
  };

  if (retries < 0) {
    return { message: unknownError };
  }

  const res = await fetchApi("/me", {
    init: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  if (!res.ok) {
    let message: ZoozieUserMessage | undefined;
    switch (res.status) {
      case 401:
        const currentRefreshToken = cookies().get("refresh-token")?.value;
        if (!currentRefreshToken) {
          return { message: unknownError };
        }

        const {
          accessToken,
          refreshToken,
          message: msg,
        } = await refreshTokens(currentRefreshToken);
        if (!accessToken || !refreshToken) {
          message = msg ?? unknownError;

          return { message };
        }

        updateCookies(accessToken, refreshToken);
        return fetchUser(accessToken, retries - 1);
      case 403:
        message = {
          status: "failure",
          message: t("user-deactivated"),
        };
        break;
      default:
        console.error("unexpected /me status", res.status);
        message = unknownError;
    }
  }

  const user = (await res.json())?.data?.user as TUser | undefined;
  return { user };
}

// TODO: use a custom ZoozError instead
async function refreshTokens(refreshToken: string): Promise<{
  accessToken?: string;
  refreshToken?: string;
  message?: ZoozieUserMessage;
}> {
  const t = await getTranslations("customer.auth");
  const unknownError: ZoozieUserMessage = {
    status: "failure",
    message: t("failure"),
  };

  const res = await fetchApi("/auth/refresh-token", {
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    },
  });

  let message: ZoozieUserMessage | undefined;
  if (!res.ok) {
    switch (res.status) {
      case 403:
        message = {
          status: "failure",
          message: t("user-deactivated"),
        };
        break;
      default:
        console.error("unexpected /auth/refresh-token error", res);
        message = unknownError;
    }
  }

  const data = (await res.json())?.data;
  if (!data) {
    message = unknownError;
  }

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    message,
  };
}

function updateCookies(accessToken: string, refreshToken: string) {
  const opts = {
    secure: true,
    httpOnly: true,
    sameSite: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  cookies().set("access-token", accessToken, opts);
  cookies().set("refresh-token", refreshToken, opts);
}

type TRegisterCustomerResponsePayload = {
  data?: {
    user?: {
      accessToken?: string;
      refreshToken?: string;
    };
  };
};
