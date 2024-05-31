"use client";

import Button, { ButtonProps } from "@/components/shared/button";
import { useTranslations } from "next-intl";
import Spinner from "../spinner";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

/**
 * Submit button component.
 *
 * This component is a submit button that is disabled when the form is
 * submitting.
 */
export default function SubmitButton({
  className,
  children,
  ...rest
}: ButtonProps): JSX.Element {
  const t = useTranslations("customer.auth");
  const { pending } = useFormStatus();

  return (
    <Button
      className={cn("flex items-center justify-center gap-2xs-xs", className)}
      disabled={pending}
      {...rest}
    >
      {pending && <Spinner />} {children}
    </Button>
  );
}
