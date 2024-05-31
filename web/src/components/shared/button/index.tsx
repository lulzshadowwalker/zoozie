import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  typ?: "primary" | "secondary";
  square?: boolean;
}

export default function Button({
  className,
  children,
  square,
  disabled,
  typ = "primary",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "block rounded-2xl text-lg font-medium outline-none transition-all ",
        {
          "bg-gray-200 hover:bg-gray-300 focus:bg-gray-300":
            typ === "secondary" && !disabled,
          "bg-accent-1 hover:bg-focused-accent-1 focus:bg-focused-accent-1":
            typ === "primary" && !disabled,
        },
        {
          "px-m-l py-2xs-xs": !square,
          "aspect-square p-2xs-xs": square,
        },
        {
          "active:scale-[0.98]": !disabled,
          "pointer-events-none text-gray-500": disabled,
        },
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
