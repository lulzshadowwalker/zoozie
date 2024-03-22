"use client";

import Button from "@/components/shared/button";
import { useTranslations } from "next-intl";
import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { }

export default function SubmitButton({ className }: Props) {
  const t = useTranslations("customer.auth");
  const { pending } = useFormStatus();

  return (
    <Button className={className} disabled={pending}>
      {t("sign-in")}
    </Button>
  );
}
