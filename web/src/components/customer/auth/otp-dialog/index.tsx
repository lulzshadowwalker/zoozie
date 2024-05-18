"use client";

import SubmitButton from "@/components/shared/submit-button";
import ZoozInput from "@/components/shared/zooz-input";
import { verifyOtp } from "@/lib/actions/auth";
import { cn, showToast } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useFormState } from "react-dom";
import ResendButton from "./components/resend-button";

export type TOtpDialogHandle = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
};

type TProps = {
  verifier?: (prompt: string) => void;
};

const OtpDialog = forwardRef<TOtpDialogHandle, TProps>(function OtpDialog(
  { verifier },
  ref,
) {
  const t = useTranslations("customer.auth");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, dispatch] = useFormState(verifyOtp, undefined);
  const [prompt, setPrompt] = useState("");

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function toggle() {
    isOpen ? close() : open();
  }

  useImperativeHandle(ref, () => ({
    open,
    close,
    isOpen,
    toggle,
  }));

  useEffect(
    function showUserToast() {
      if (message) {
        showToast(message);

        if (message.status === "success") {
          close();
        }
      }
    },
    [message],
  );

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
      }
    }

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black opacity-50"></div>}

      <dialog
        ref={dialogRef}
        open={isOpen}
        className={cn(
          "top-1/2 z-30 h-full max-h-[28rem] w-[96%] max-w-[64rem] -translate-y-1/2 items-center justify-center rounded-2xl border drop-shadow-sm dark:drop-shadow-none",
          {
            "flex flex-col": isOpen,
          },
        )}
      >
        <h2 className="text-center text-2xl font-medium">
          {t("verification-code")}
        </h2>
        <p className="text-center text-lg font-light text-gray-500">
          {t("enter-verification-code")}
        </p>

        <form action={verifier ? undefined : dispatch}>
          <ZoozInput
            id="otp"
            label={t("verification-code")}
            type="text"
            name="otp"
            placeholder="● ● ● ●"
            containerClassName="max-w-fit mx-auto my-m-l"
            inputClassName="text-center focus:placeholder:text-transparent"
            labelClassName="text-center"
            required
            onChange={({ target: { value } }) => setPrompt(value)}
          />

          <div className="flex items-center gap-xs-s">
            <SubmitButton
              type={verifier ? "button" : "submit"}
              onClick={() => {
                if (verifier) {
                  verifier(prompt);
                }
              }}
            >
              {t("verify")}
            </SubmitButton>
            {/* FIXME: pass phone number to resend button or use zustand */}
            <ResendButton
              phoneNumber={{ countryCode: "US", phoneNumber: "1234567890" }}
            />
          </div>
        </form>
      </dialog>
    </>
  );
});

export default OtpDialog;
