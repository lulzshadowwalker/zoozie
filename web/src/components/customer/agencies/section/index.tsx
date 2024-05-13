import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export default function Section({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "mx-auto mt-l-xl max-w-page px-page [&>*:first-child]:border-t [&>*:first-child]:pt-l-xl",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
