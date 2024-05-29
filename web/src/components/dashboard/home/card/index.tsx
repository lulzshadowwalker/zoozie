import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
}

export default function Card({
  children,
  className,
  title,
  subtitle,
  ...rest
}: Props) {
  return (
    <div
      className={cn("rounded-2xl border px-s-m py-xs-s", className)}
      {...rest}
    >
      <div className="mb-l-xl">
        <h2 className="text-xl font-medium">{title}</h2>
        {subtitle && (
          <p className="text-lg font-light text-gray-400">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
