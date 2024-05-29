"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

type Props = {
  title: string;
  href: string;
  icon: IconProp;
};

export default function LinkItem({ title, href, icon }: Props) {
  const pathname = usePathname();

  const { agency, sanitizedPathname } = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const [agency, ...rest] = segments;
    const sanitizedPathname = `/${rest.join("/")}`;

    return { agency, sanitizedPathname };
  }, [pathname]);

  const isActive = useMemo(() => {
    if (href === "/") {
      return sanitizedPathname === href;
    }

    return sanitizedPathname.startsWith(href);
  }, [sanitizedPathname, href]);

  return (
    <Link
      href={agency + href}
      title={title}
      className={cn(
        "group flex items-center justify-center text-gray-300 focus:text-on-primary-1",
        {
          "pointer-events-none": isActive,
        },
      )}
    >
      {isActive && (
        <div className="w-[4px] self-stretch rounded-ee-md rounded-se-md bg-black" />
      )}

      <FontAwesomeIcon
        icon={icon}
        size="lg"
        className={cn(
          "mx-auto cursor-pointer py-xs text-inherit transition-all hover:text-on-primary-1",
          {
            "text-on-primary-1": isActive,
          },
        )}
      />
    </Link>
  );
}
