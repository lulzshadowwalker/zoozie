import { cn } from "@/lib/utils";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon: IconProp;
}

export default function ButtonItem({ title, icon, className, ...rest }: Props) {
  return (
    <button
      title={title}
      className={cn(
        "group flex items-center justify-center text-gray-300 focus:text-on-primary-1",
        className,
      )}
      {...rest}
    >
      <FontAwesomeIcon
        icon={icon}
        size="lg"
        className="mx-auto cursor-pointer py-xs text-inherit transition-all hover:text-on-primary-1"
      />
    </button>
  );
}
