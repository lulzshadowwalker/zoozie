import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

/**
 * intelligently applies your tailwind overrides and conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
