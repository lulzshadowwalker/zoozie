import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
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
}: Props) {
  return (
    <button
      className={cn(
        "rounded-2xl text-lg font-medium transition-all outline-none ",
        {
          "bg-gray-200 hover:bg-gray-300 focus:bg-gray-300":
            typ === "secondary" && !disabled,
          "bg-accent-1 hover:bg-focused-accent-1 focus:bg-focused-accent-1":
            typ === "primary" && !disabled,
        },
        {
          "px-m-l py-2xs-xs": !square,
          "p-2xs-xs aspect-square": square,
        },
        {
          "active:scale-[0.98]": !disabled,
          "saturate-[0.6] pointer-evenets-none": disabled,
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
