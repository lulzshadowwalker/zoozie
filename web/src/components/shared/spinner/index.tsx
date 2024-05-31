import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  color?: string;
}

export default function Spinner({ className, size, color, ...rest }: Props) {
  const t = useTranslations();
  const defaultSize = 28;

  return (
    <div role="status" className={cn("inline-block", className)} {...rest}>
      <svg
        className="animate-spin"
        style={{
          width: size ?? defaultSize,
          height: size ?? defaultSize,
          color: color ?? "rgb(var(--focused-accent-color-1))",
        }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="sr-only">{t("loading")}</span>
    </div>
  );
}
