import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  leading?: ReactNode;
  trailing?: ReactNode;
}

export default function Header({
  leading,
  trailing,
  className,
  ...rest
}: Props) {
  return (
    <header
      className={cn(
        "flex items-center justify-between bg-gray-50 px-xl-2xl py-s-m",
        className,
      )}
      {...rest}
    >
      {leading}
      {trailing}
    </header>
  );
}
