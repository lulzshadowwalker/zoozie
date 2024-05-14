"use client";

import Button from "@/components/shared/button";
import ZoozImage from "@/components/shared/zooz-image";
import ZoozInput from "@/components/shared/zooz-input";
import ZoozTextarea from "@/components/shared/zooz-textarea";
import { generateApiUrl } from "@/lib/api";
import { useUser } from "@/lib/context/user";
import { useToastHelpers } from "@/lib/hooks";
import { Locale } from "@/lib/i18n/config";
import { useRouter } from "@/lib/i18n/navigation";
import { TAgency, TZoozieUserMessage } from "@/lib/types";
import { cn, getAgencyImage, getCustomerImage, showToast } from "@/lib/utils";
import {
  faStar as faStarSolid,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocale, useTranslations } from "next-intl";
import { revalidatePath, revalidateTag } from "next/cache";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";

type Props = {
  agency: TAgency;
};

export default function WriteReviewButton({ agency }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations("customer.agency");
  const locale = useLocale() as Locale;
  const [isClosed, setIsClosed] = useState(true);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [rating, setRating] = useState<number>();
  const { user, accessToken } = useUser();
  const { showAuthRequiredToast } = useToastHelpers();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const unknownError: TZoozieUserMessage = {
      status: "failure",
      message: t("something-went-wrong"),
    };

    if (!accessToken.value) {
      showAuthRequiredToast();
      return;
    }

    try {
      const form = new FormData(e.target as HTMLFormElement);

      const url = generateApiUrl({
        endpoint: `/agencies/${agency.id}/reviews`,
        locale,
      });

      const res = await fetch(url.href, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken.value}` },
        body: form,
      });

      if (!res.ok) {
        switch (res.status) {
          case 403:
            showToast({
              status: "warning",
              message: t("agents-cannot-write-reviews"),
            });
            return;
          case 409:
            showToast({
              status: "warning",
              message: t("review-already-exists"),
            });
            resetAndToggle();
            return;
          default:
            showToast(unknownError);
            console.error("failed to send review because %s", res.statusText);
            return;
        }
      }

      showToast({
        status: "success",
        message: t("review-sent"),
      });

      resetAndToggle();
      router.refresh();
    } catch (e) {
      console.error(e);
      showToast(unknownError);
    }
  }

  function resetAndToggle() {
    formRef.current?.reset();
    toggleDialog();
  }

  function submitForm() {
    if (!formRef.current) {
      console.error("form ref not found");
      return;
    }

    formRef.current.reportValidity() &&
      formRef.current.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
  }

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }

    isClosed ? dialogRef.current.showModal() : dialogRef.current.close();
    setIsClosed((prev) => !prev);
  }

  return (
    <>
      <dialog
        ref={dialogRef}
        className={cn("w-[min(calc(100%-10px),65rem)] rounded-2xl", {
          "flex flex-col": !isClosed,
        })}
        onClose={(e) => {
          setIsClosed(true);
        }}
      >
        <header className="flex items-center gap-xs-s border-b border-gray-200 px-m-l py-s-m">
          <div className="relative h-[6.4rem] w-[6.4rem] overflow-hidden rounded-full bg-gray-100 drop-shadow-md">
            <Image
              src={getAgencyImage(agency.logo)}
              alt={agency.name ?? t("agency-logo")}
              title={agency.name ?? t("agency-logo")}
              fill
              sizes="56px"
              className="object-contain"
            />
            kj
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {agency.name ?? t("unknown-agency")}
            </h2>
            <p className="text-base font-light text-gray-400">
              {t("rate-this-agency")}
            </p>
          </div>

          <Button
            square
            typ="secondary"
            className="ms-auto flex min-h-[3.4rem] w-full max-w-[3.4rem] items-center justify-center"
            onClick={toggleDialog}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </header>

        <form
          className="my-l-xl flex-grow overflow-auto"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div
            className="mb-l-xl flex justify-center gap-2xs-xs"
            onMouseLeave={() => setHoveredRating(null)}
          >
            <ZoozInput
              id="rating"
              label={t("rating")}
              type="number"
              name="rating"
              value={rating}
              required
              containerClassName="sr-only"
            />

            {[...Array(5)].map((_, index) => {
              const value = index + 1;
              const lessThanOrEqualToRating = value <= (rating ?? 0);
              const lessThanOrEqualToHoveredRating =
                value <= (hoveredRating ?? 0);

              return (
                <FontAwesomeIcon
                  icon={faStarSolid}
                  key={index}
                  size="2xl"
                  className={cn(
                    "cursor-pointer text-gray-300 transition-all duration-[350ms] ease-out",
                    {
                      "text-orange-300":
                        lessThanOrEqualToRating ||
                        lessThanOrEqualToHoveredRating,
                    },
                  )}
                  onMouseEnter={() => setHoveredRating(value)}
                  onClick={() => setRating(value)}
                />
              );
            })}
          </div>

          <div className="mx-auto flex items-start gap-s-m px-m-l">
            <div className="relative h-xl-2xl w-xl-2xl overflow-hidden rounded-3xl">
              <ZoozImage
                src={getCustomerImage(user?.value?.profilePicture)}
                alt={user?.value?.name ?? t("customer-avatar")}
                title={user?.value?.name ?? t("customer-avatar")}
                fill
                sizes="(min-width: 1340px) 50px, (min-width: 620px) calc(1.71vw + 27px), calc(7.67vw - 8px)"
                quality={65}
              />
            </div>
            <div className="w-full">
              <h3 className="text-lg text-gray-400">
                {user?.value?.name ?? t("unknown-customer")}
              </h3>

              <ZoozTextarea
                id="review-input"
                label={t("review")}
                name="content"
                labelClassName="sr-only"
                placeholder={t("review-placeholder")}
                containerClassName="mt-2xs-xs w-full text-lg text-on-primary-1/80 border-none rounded-none"
                inputClassName="rounded-none"
                style={{ paddingInline: 0, paddingBlock: 0 }}
                rows={5}
              ></ZoozTextarea>
            </div>
          </div>
        </form>

        <footer className="border-t border-gray-200 px-m-l py-m-l">
          <Button className="ms-auto" onClick={submitForm}>
            {t("submit")}
          </Button>
        </footer>
      </dialog>

      <button
        className="ms-auto mt-xs-s underline underline-offset-4 outline-none hover:decoration-transparent focus:decoration-transparent"
        onClick={toggleDialog}
      >
        {t("write-review")}
      </button>
    </>
  );
}
