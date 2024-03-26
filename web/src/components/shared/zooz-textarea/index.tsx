import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLTextAreaElement> {
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
        "rounded-2xl border border-gray-200 overflow-hidden flex flex-col transition-all focus-within:border-on-primary-1 w-full",
        containerClassName,
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          "text-base text-on-primary-1 font-medium px-xs-s py-3xs-2xs bg-gray-200",
          labelClassName,
        )}
      >
        {label}
      </label>

      <textarea
        id={id}
        className={cn("rounded-2xl px-xs-s py-3xs-2xs w-full outline-none placeholder:text-lg", inputClassName)}
        maxLength={10000}
        rows={10}
        {...rest}
      />
    </div>
  );
}

