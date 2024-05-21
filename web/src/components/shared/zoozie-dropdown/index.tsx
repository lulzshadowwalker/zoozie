"use client";

import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useId, useState } from "react";
import styles from "./style.module.css";
import { cn } from "@/lib/utils";

type Props = {
  title: string | ReactNode;
  children?: React.ReactNode;
  buttonClassName?: string;
  listClassName?: string;
};

export default function ZoozieDropDown({
  title,
  children,
  buttonClassName,
  listClassName,
}: Props) {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <div className="relative inline-block" onMouseLeave={close}>
      <button
        type="button"
        className={cn(
          "inline-flex w-full items-center justify-center gap-x-[0.8rem] rounded-xl bg-primary-1 px-xs-s py-3xs-2xs text-lg text-gray-500 outline-none transition-all hover:bg-gray-100 focus:bg-gray-100 focus:text-on-primary-1 dark:text-gray-400",
          buttonClassName,
        )}
        id={id}
        aria-expanded="true"
        aria-haspopup="true"
        onClick={open}
        onMouseEnter={open}
      >
        {typeof title === "string" ? (
          <>
            {title}
            <FontAwesomeIcon
              icon={faAngleDown}
              className={cn("transition-all duration-300 ease-out", {
                "rotate-180": isOpen,
              })}
            />
          </>
        ) : (
          title
        )}
      </button>

      <div
        className={cn(
          "absolute end-0 z-10 w-[15rem] origin-top-right rounded-lg bg-primary-1 ring-1 ring-on-primary-1 ring-opacity-5 drop-shadow-md focus:outline-none",
          {
            "pointer-events-none scale-95 opacity-0 duration-300": !isOpen,
            "scale-100 opacity-100 duration-200": isOpen,
          },
          listClassName,
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={id}
        tabIndex={-1}
      >
        <div className={`py-[0.35rem] ${styles["dropdown-list"]}`} role="none">
          {children}
        </div>
      </div>
    </div>
  );
}
