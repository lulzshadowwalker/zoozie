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
  typ = "primary",
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        "rounded-2xl text-lg font-medium transition-all outline-none active:scale-[0.98]",
        {
          "bg-gray-200 hover:bg-gray-300 focus:bg-gray-300":
            typ === "secondary",
          "bg-accent-1 hover:bg-focused-accent-1 focus:bg-focused-accent-1":
            typ === "primary",
        },
        {
          "px-m-l py-3xs-2xs": !square,
          "p-2xs-xs aspect-square": square,
        },
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
