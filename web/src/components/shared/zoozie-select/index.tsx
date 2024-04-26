import { HTMLAttributes } from "react";
import { cn } from "@utils";
import { useTranslations } from "next-intl";

interface Props
  extends Omit<HTMLAttributes<HTMLSelectElement>, "id" | "className"> {
  id: string;
  label: string;
  labelClassName?: string;
  containerClassName?: string;
  selectClassName?: string;
}
export default function ZoozieSelect({
  label,
  labelClassName,
  selectClassName,
  containerClassName,
  id,
  children,
  ...rest
}: Props) {
  const t = useTranslations("dashboard.create-listing");

  return (
    <div className={containerClassName}>
      <label htmlFor={id} className={cn("mb-3xs-2xs block", labelClassName)}>
        {label}
      </label>
      <select
        id={id}
        className={cn(
          "w-full rounded-2xl border-2 border-gray-300 px-xs-s py-3xs-2xs pe-12 outline-none transition-all focus:border-on-primary-1",
          selectClassName,
        )}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
