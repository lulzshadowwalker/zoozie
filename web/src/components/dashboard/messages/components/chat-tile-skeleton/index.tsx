import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ChatTileSkeletonProps extends HTMLAttributes<HTMLElement> {}

export function ChatTileSkeleton({
  className,
  ...rest
}: ChatTileSkeletonProps) {
  return (
    <div
      className={cn("flex items-start gap-xs-s rounded-2xl p-s-m", className)}
      {...rest}
    >
      <div className="relative min-h-xl-2xl w-full max-w-xl-2xl animate-pulse overflow-hidden rounded-full bg-gray-200"></div>

      <div className="flex-grow">
        <div className="h-s-m w-full max-w-[15rem] animate-pulse rounded-sm bg-gray-200"></div>

        <div className="mb-3xs-2xs mt-2xs-xs h-xs-s w-full animate-pulse rounded-sm bg-gray-200"></div>
        <div className="h-xs-s w-full animate-pulse rounded-sm bg-gray-200"></div>
      </div>
    </div>
  );
}
