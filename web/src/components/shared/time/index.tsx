"use client";

import { useFormatDateTime } from "@/lib/hooks";
import { HTMLAttributes, TimeHTMLAttributes } from "react";

interface Props
  extends Omit<TimeHTMLAttributes<HTMLTimeElement>, "children" | "dateTime"> {
  dateTime: string;
}

export default function Time({ dateTime, className, ...rest }: Props) {
  const { formatDateTime } = useFormatDateTime();

  return (
    <time dateTime={dateTime} className={className} {...rest}>
      {formatDateTime(dateTime)}
    </time>
  );
}
