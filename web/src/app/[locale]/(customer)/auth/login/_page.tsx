"use client";

import ZoozInput from "@/components/shared/zooz-input";
import { login } from "@/lib/actions/auth";
import { useFormState } from "react-dom";
import { showToast } from "@/lib/utils";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import SubmitButton from "@/components/customer/auth/login/submit-button";
import Button from "@/components/shared/button";
import { Link } from "@/lib/i18n/navigation";

export default function Login() {
  const t = useTranslations("customer.auth");
  const [message, dispatch] = useFormState(login, undefined);

  useEffect(
    function showUserToast() {
      if (message) {
        showToast(message);
      }
    },
    [message],
  );

  return (
    <main className="my-2xl-3xl">
      <form
        action={dispatch}
        className="max-w-[90rem] mx-auto px-page flex flex-col gap-y-xs-s"
      >
        <div className="my-s-m">
          <h1 className="text-3xl font-medium">{t("welcome-back")}</h1>
          <p className="text-xl font-light text-gray-400">
            {t("enter-credentials")}
          </p>
        </div>

        <ZoozInput
          id="email-address"
          label="Email address"
          type="email"
          name="email"
          placeholder="email address"
          required
        />
        <ZoozInput
          id="password"
          label="Password"
          type="password"
          name="password"
          minLength={8}
          placeholder="password"
          required
        />

        <div className="flex items-center gap-s-m max-md:flex-col max-md:items-stretch">
          <SubmitButton className="flex-grow-[2] basis-0" />
          <Button typ="secondary" className="flex-grow basis-0">
            <Link href="/auth/register">
              {t("sign-up")}
            </Link>
          </Button>
        </div>
      </form>
    </main>
  );
}
