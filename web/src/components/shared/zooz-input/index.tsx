import { cn } from "@/lib/utils";
import { HTMLAttributes, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
}

export default function ZoozInput({
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
        "rounded-2xl border border-gray-200 flex flex-col px-xs-s py-3xs-2xs transition-all focus-within:border-on-primary-1 w-full",
        containerClassName,
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          "text-base text-gray-400 font-extralight",
          labelClassName,
        )}
      >
        {label}
      </label>
      <input
        id={id}
        className={cn("outline-none placeholder:text-lg", inputClassName)}
        {...rest}
      />
    </div>
  );
}
