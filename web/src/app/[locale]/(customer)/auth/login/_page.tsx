"use client";

import ZoozInput from "@/components/shared/zooz-input";
import { login, sendOtp } from "@/lib/actions/auth";
import { useFormState } from "react-dom";
import { showToast } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SubmitButton from "@/components/shared/submit-button";
import Button from "@/components/shared/button";
import { Link } from "@/lib/i18n/navigation";
import OtpDialog, {
  TOtpDialogHandle,
} from "@/components/customer/auth/otp-dialog";
import { TPhoneNumber } from "@/lib/types";

export default function Login() {
  const t = useTranslations("customer.auth");
  const [phoneNumber, setPhoneNumber] = useState<TPhoneNumber>({
    countryCode: "962",
    phoneNumber: "",
  });
  const sendOtpToPhoneNumber = sendOtp.bind(null, phoneNumber);
  const otpDialogRef = useRef<TOtpDialogHandle>(null);

  async function handleSendOtp() {
    if (phoneNumber.phoneNumber == "") {
      showToast({
        status: "failure",
        message: t("bad-request"),
      });
      return;
    }

    const message = await sendOtpToPhoneNumber();
    showToast(message);
    if (message.status === "success") {
      if (otpDialogRef.current) {
        otpDialogRef.current.toggle();
      }
    }
  }

  async function handleOtpVerification(prompt: string) {
    let otpLogin = login.bind(null, {
      phoneNumber,
      otp: prompt,
    });
    const message = await otpLogin();
    if (message) {
      showToast(message);
    }
  }

  return (
    <>
      <main className="my-2xl-3xl">
        <form
          action={handleSendOtp}
          className="mx-auto flex max-w-[90rem] flex-col gap-y-xs-s px-page"
        >
          <div className="my-s-m">
            <h1 className="text-3xl font-medium">{t("welcome-back")}</h1>
            <p className="text-xl font-light text-gray-400">
              {t("enter-phone-number-to-continue")}
            </p>
          </div>

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
              onChange={({ target: { value } }) => {
                setPhoneNumber((prev) => ({
                  ...prev,
                  phoneNumber: value,
                }));
              }}
            />
          </div>

          <div className="flex items-center gap-s-m max-md:flex-col max-md:items-stretch">
            <SubmitButton className="flex-grow-[2] basis-0">
              {t("sign-in")}
            </SubmitButton>

            <Link href="/auth/register" className="flex-grow basis-0">
              <Button type="button" typ="secondary" className="w-full">
                {t("sign-up")}
              </Button>
            </Link>
          </div>
        </form>
      </main>{" "}
      <OtpDialog ref={otpDialogRef} verifier={handleOtpVerification} />
    </>
  );
}
