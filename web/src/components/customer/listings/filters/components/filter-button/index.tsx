"use client";

import Button from "@/components/shared/button";
import ZoozInput from "@/components/shared/zooz-input";
import { cn } from "@/lib/utils";
import { faHotel, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { ButtonHTMLAttributes, HTMLAttributes, useRef, useState } from "react";

export default function FilterButton() {
  const t = useTranslations("customer.listings");
  const tCurrency = useTranslations("currency");

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosed, setIsClosed] = useState(true);

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
        className={cn("max-w-[65rem] w-full rounded-2xl", {
          "flex flex-col": !isClosed,
        })}
        onClose={(e) => {
          setIsClosed(true);
        }}
      >
        <header className="flex items-center py-s-m px-m-l border-b border-gray-200">
          <Button
            square
            typ="secondary"
            className="max-w-[3.4rem] min-h-[3.4rem] w-full flex items-center justify-center"
            onClick={toggleDialog}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>

          <h2 className="mx-auto text-lg font-semibold -translate-x-1/2">
            {t("filters")}
          </h2>
        </header>

        <section className="divide-y divide-gray-200 px-m-l [&>*]:py-m-l flex-grow overflow-auto">
          <DialogSection
            title="Type of Listing"
            subtitle="are you looking to buy or rent a property?"
          >
            <div className="flex items-center">
              {[...Array(3)].map((_, index) => {
                const isFirst = index === 0;
                const isLast = index === [...Array(3)].length - 1;

                return (
                  <DialogButton
                    key={index}
                    selected={isFirst}
                    className={cn(
                      "flex-grow px-m-l py-l-xl rounded-none",
                      {
                        "rounded-s-3xl": isFirst,
                        "rounded-e-3xl": isLast,
                      },
                      {
                        "border-e-0 hover:border-e": !isLast,
                      },
                    )}
                  >
                    Any Type
                  </DialogButton>
                );
              })}
            </div>
          </DialogSection>

          <DialogSection
            title="Price Range"
            subtitle="What budget do you have in mind?"
          >
            <div className="flex items-center gap-s-m">
              <ZoozInput
                id="budget-min"
                label={t("minimum")}
                type="number"
                placeholder={`0 ${tCurrency("jod")}`}
              />

              <ZoozInput
                id="budget-max"
                label={t("maximum")}
                type="number"
                placeholder={`0 ${tCurrency("jod")}`}
              />
            </div>
          </DialogSection>

          <DialogSection title="Rooms and Bathroms">
            <div className="flex items-center gap-xs-s overflow-scroll">
              {[...Array(10)].map((_, index) => (
                <DialogButton selected={index === 0} key={index}>
                  {index === 0 ? "All" : index}
                </DialogButton>
              ))}
            </div>
          </DialogSection>

          <DialogSection title="Property type">
            <div className="flex items-center gap-s-m">
              {[...Array(4)].map((_, index) => (
                <DialogButton
                  key={index}
                  className={cn(
                    "rounded-2xl flex flex-col items-start px-xs-s flex-grow",
                    {
                      "border-2 border-on-primary-1 text-on-primary-1 bg-gray-100":
                        index === 0,
                    },
                  )}
                  selected={index === 0}
                >
                  <FontAwesomeIcon icon={faHotel} size="xl" />
                  <h4 className="font-semibold mt-l-xl">Apartment</h4>
                </DialogButton>
              ))}
            </div>
          </DialogSection>
        </section>

        <footer className="py-m-l px-m-l border-t border-gray-200 flex items-center justify-between">
          <Button typ="secondary">{t("clear")}</Button>
          <Button>Show 685 places </Button>
        </footer>
      </dialog>

      <Button typ="secondary" onClick={toggleDialog}>
        {t("filters")}
      </Button>
    </>
  );
}

interface Props extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: string;
  subtitle?: string;
}

function DialogSection({
  title,
  subtitle,
  children,
  className,
  ...rest
}: Props) {
  return (
    <section className={cn(className)} {...rest}>
      <h3 className="text-xl font-medium">{title}</h3>
      {subtitle && (
        <p className="text-lg text-gray-400 font-extralight">{subtitle}</p>
      )}
      <div className="my-m-l">{children}</div>
    </section>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

function DialogButton({ className, children, selected, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "border border-gray-300 rounded-full px-m-l py-2xs-xs outline-none transition-all hover:border-on-primary-1 focus:border-on-primary-1 active:bg-gray-100",
        {
          "bg-on-primary-1 text-primary-1 active:bg-on-primary-1": selected,
        },
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
