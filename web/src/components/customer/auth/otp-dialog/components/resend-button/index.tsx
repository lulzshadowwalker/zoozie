import Button from "@/components/shared/button";
import { sendOtp } from "@/lib/actions/auth";
import { showToast } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

type Props = {
  phoneNumber: {
    countryCode: string;
    phoneNumber: string;
  };
};

export default function ResendButton({ phoneNumber }: Props) {
  const t = useTranslations("customer.auth");
  const [delay, setDelay] = useState(0);

  const disabled = !!delay;
  const defaultDelay = 40;

  async function handleResendOtp() {
    const message = await sendOtp(phoneNumber);
    showToast(message);
    setDelay(defaultDelay);
  }

  useEffect(
    function handleResendDelay() {
      if (!disabled) {
        return;
      }

      const intervalId = setInterval(
        () =>
          setDelay((prev) => {
            if (prev > 0) {
              return prev - 1;
            }

            return prev;
          }),
        1000,
      );

      return () => clearInterval(intervalId);
    },
    [disabled],
  );

  return (
    <Button
      type="button"
      typ="secondary"
      onClick={handleResendOtp}
      disabled={disabled}
    >
      {t("resend-code")}
      {disabled && ` (${delay}${t("seconds")})`}
    </Button>
  );
}
