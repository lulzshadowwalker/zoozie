"use client";

import Button from "@/components/shared/button";
import ZoozInput from "@/components/shared/zooz-input";
import { useTranslations } from "next-intl";

export function ChatViewInput() {
  const t = useTranslations("dashboard.messages");

  return (
    <section className="mt-auto space-y-s-m border-t border-gray-300 pt-s-m">
      <ZoozInput
        id="message-input"
        label={t("message-input")}
        labelClassName="sr-only"
        containerClassName="border-none"
        type="text"
        placeholder={t("write-your-message")}
      />

      <Button type="button" className="ms-auto">
        {t("send")}
      </Button>
    </section>
  );
}
