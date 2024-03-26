import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  inputClassName?: string;
  labelClassName?: string;
}

export default function ZoozCheckbox({
  inputClassName,
  id,
  label,
  labelClassName,
  ...rest
}: Props) {
  return (
    <div className="flex items-center gap-xs-s">
      <input
        id={id}
        className={cn(
          "w-[2.25rem] h-[2.25rem] rounded-full checked:accent-on-primary-1 outline-on-primary-1 focus:outline-2 checked:focus:accent-on-primary-1/60",
          inputClassName,
        )}
        type="checkbox"
        {...rest}
      />

      <label htmlFor={id} className={cn("tex-lg", labelClassName)}>
        {label}
      </label>
    </div>
  );
}
