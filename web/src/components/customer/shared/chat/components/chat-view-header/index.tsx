"use client";

import Button from "@/components/shared/button";
import { Link } from "@/lib/i18n/navigation";
import { useCustomerMessagesStore } from "@/lib/store/customer-messages";
import { getAgencyImage } from "@/lib/utils";
import {
  faMessage,
  faAngleDown,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ChatViewHeader() {
  const t = useTranslations("customer.messages");
  const { conversation, setConversation, setIsOpen } =
    useCustomerMessagesStore();
  const agency = conversation?.agency;

  function close() {
    setIsOpen(false);
  }

  function back() {
    setConversation(null);
  }

  return (
    <header className="flex items-center gap-3xs-2xs rounded-b-3xl bg-accent-1 px-s-m py-xs-s">
      {agency && (
        <>
          <Button
            onClick={back}
            square
            className="flex h-12 w-12 items-center justify-center text-gray-50"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              size="lg"
              className="rtl:scale-x-[-1]"
            />
          </Button>

          <Link
            href={`/agencies/${agency.slug}`}
            className="relative h-[42px] w-[42px] overflow-hidden rounded-full"
          >
            <Image
              src={getAgencyImage(agency.logo)}
              alt={`${agency.name} ${t("logo")}`}
              fill
              sizes="42px"
            />
          </Link>

          <Link
            href={`/agencies/${agency.slug}`}
            className="focus:decoration-transparent"
          >
            <h2 className="font-medium text-gray-50">
              {agency?.name ?? t("messages")}
            </h2>
          </Link>
        </>
      )}

      {!agency && (
        <>
          <FontAwesomeIcon
            icon={faMessage}
            size="lg"
            className="text-gray-50"
          />
          <h2 className="font-medium text-gray-50">{t("messages")}</h2>
        </>
      )}

      <Button
        square
        className="ms-auto flex h-12 w-12 items-center justify-center text-gray-50"
        onClick={close}
      >
        <FontAwesomeIcon icon={faAngleDown} size="lg" />
      </Button>
    </header>
  );
}
