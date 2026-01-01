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
      className={cn(
        "rounded-2xl border border-gray-300 bg-gray-50/80 px-s-m py-xs-s transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1",
        className,
      )}
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
