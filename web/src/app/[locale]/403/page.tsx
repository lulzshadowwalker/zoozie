"use client";

import Button from "@/components/shared/button";
import { switchAccount } from "@/lib/actions/auth";
import { Link, redirect } from "@/lib/i18n/navigation";
import Lottie from "lottie-react";
import animation from "../../../../public/assets/animations/girl-knocking-on-door.json";
import { useTranslations } from "next-intl";

export default function Forbidden() {
  const t = useTranslations("403");

  return (
    <main className="min-w-screen flex min-h-screen -translate-y-[6rem] flex-col items-center justify-center">
      <Lottie
        animationData={animation}
        loop={true}
        className="z-[-10] mx-auto max-w-3xl translate-y-[9rem]"
      />
      <h1 className="text-4xl font-semibold text-accent-1">
        {t("access-denied")}
      </h1>
      <p className="text-xl font-light text-gray-400 dark:text-gray-300">
        {t("message")}
      </p>

      <section className="mt-l-xl flex flex-wrap items-center justify-center gap-xs-s">
        <form action={switchAccount}>
          <Button>{t("switch-account")}</Button>
        </form>
        <Link href="/">
          <Button typ="secondary">{t("take-me-home")}</Button>
        </Link>
      </section>
    </main>
  );
}
