import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  typ?: "primary" | "secondary";
}

export default function Button({
  className,
  children,
  typ = "primary",
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        "px-m-l py-3xs-2xs rounded-2xl text-lg font-medium transition-all outline-none",
        {
          "bg-gray-200 hover:bg-gray-300 focus:bg-gray-300":
            typ === "secondary",
          "bg-accent-1 hover:bg-focused-accent-1 focus:bg-focused-accent-1":
            typ === "primary",
        },
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
