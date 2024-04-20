"use client";

import { registerCustomer } from "@/lib/actions/auth";
import { useFormState } from "react-dom";
import { showToast } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import OtpDialog, {
  TOtpDialogHandle,
} from "@/components/customer/auth/otp-dialog";
import ProfilePictureInput from "@/components/customer/auth/profile-picture-input";
import Button from "@/components/shared/button";
import SubmitButton from "@/components/shared/submit-button";
import ZoozInput from "@/components/shared/zooz-input";
import { Link } from "@/lib/i18n/navigation";

export default function Register() {
  const t = useTranslations("customer.auth");
  const [message, dispatch] = useFormState(registerCustomer, undefined);
  const otpDialogRef = useRef<TOtpDialogHandle>(null);

  function toggleOtpDialog() {
    if (otpDialogRef.current) {
      otpDialogRef.current.toggle();
    }
  }

  useEffect(
    function showUserToast() {
      if (message) {
        showToast(message);

        if (message.status === "success") {
          toggleOtpDialog();
        }
      }
    },
    [message],
  );

  return (
    <>
      <main className="my-2xl-3xl">
        <form
          action={dispatch}
          className="mx-auto flex max-w-[90rem] flex-col gap-y-xs-s px-page"
        >
          <div className="my-s-m">
            <h1 className="text-3xl font-medium">
              {t("discover-your-dream-home")}
            </h1>
            <p className="text-xl font-light text-gray-400">
              {t("fill-in-your-details")}
            </p>
          </div>

          <ProfilePictureInput />
          <ZoozInput
            id="name"
            label={t("name")}
            type="text"
            name="name"
            placeholder={t("name-placeholder")}
            required
          />

          <div className="flex items-center gap-xs-s">
            <ZoozInput
              id="country-code"
              label={t("country-code")}
              type="number"
              name="countryCode"
              minLength={1}
              maxLength={3}
              placeholder="962"
              readOnly
              value={962}
              required
              containerClassName="pointer-events-none max-w-fit"
              labelClassName="text-center"
              inputClassName="text-center"
            />

            <ZoozInput
              id="phone-number"
              label={t("phone-number")}
              type="number"
              name="phoneNumber"
              minLength={9}
              maxLength={10}
              placeholder="7x xxx xxxx"
              containerClassName="flex-grow"
              required
            />
          </div>

          <ZoozInput
            id="email-address"
            label={t("email")}
            type="email"
            name="emailAddress"
            placeholder="email@example.com"
            required
          />

          <div className="flex items-center gap-s-m max-md:flex-col max-md:items-stretch">
            <SubmitButton className="flex-grow-[2] basis-0">
              {t("sign-up")}
            </SubmitButton>

            <Link href="/auth/login" className="flex-grow basis-0">
              <Button type="button" typ="secondary" className="w-full">
                {t("sign-in")}
              </Button>
            </Link>
          </div>
        </form>
      </main>
      <OtpDialog ref={otpDialogRef} />
    </>
  );
}
