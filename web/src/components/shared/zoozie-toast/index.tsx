"use client";

import { useParams } from "next/navigation";
import { Slide, ToastContainer, ToastContainerProps } from "react-toastify";

export default function ZoozieToast({ ...rest }: ToastContainerProps) {
  const { locale } = useParams();

  return (
    <ToastContainer
      newestOnTop
      limit={1}
      position="bottom-right"
      theme="light"
      rtl={locale === "ar"}
      transition={Slide}
      {...rest}
    />
  );
}
