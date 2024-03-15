"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

type Props = {
  href: string;
  icon: IconProp;
};

export default function Item({ href, icon }: Props) {
  const pathname = usePathname();

  const { agency, sanitizedPathname } = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const [agency, ...rest] = segments;
    const sanitizedPathname = `/${rest.join("/")}`;

    return { agency, sanitizedPathname };
  }, [pathname]);

  const isActive = sanitizedPathname === href;

  return (
    <Link
      href={agency + href}
      className={cn(
        "group flex items-center justify-center focus:!text-on-primary-1",
        {
          "pointer-events-none": isActive,
        },
      )}
    >
      {isActive && (
        <div className="w-[4px] self-stretch bg-black rounded-se-md rounded-ee-md" />
      )}

      <FontAwesomeIcon
        icon={icon}
        size="lg"
        className={cn(
          "text-gray-300 transition-all hover:text-on-primary-1 focus:text-on-primary-1 cursor-pointer mx-auto py-xs",
          {
            "text-on-primary-1": isActive,
          },
        )}
      />
    </Link>
  );
}
