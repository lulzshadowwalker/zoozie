import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
}

export default function ZoozTextarea({
  id,
  label,
  labelClassName,
  inputClassName,
  containerClassName,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 transition-all focus-within:border-on-primary-1",
        containerClassName,
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          "bg-gray-200 px-xs-s py-3xs-2xs text-base font-medium text-on-primary-1",
          labelClassName,
        )}
      >
        {label}
      </label>

      <textarea
        id={id}
        className={cn(
          "w-full rounded-2xl px-xs-s py-3xs-2xs outline-none placeholder:text-lg",
          inputClassName,
        )}
        maxLength={10000}
        rows={10}
        {...rest}
      />
    </div>
  );
}
