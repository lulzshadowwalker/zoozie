"use client";

import { signOut } from "@/lib/actions/auth";
import { showToast } from "@/lib/utils";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import ButtonItem from "../button-item";
import { useUser } from "@/lib/context/user";

export default function SignOutButton() {
  const t = useTranslations("dashboard.side-navigation-bar");
  const { refresh: refreshUser } = useUser();

  function showSignOutSuccessToast() {
    showToast({
      status: "success",
      message: t("sign-out-success"),
    });
  }

  return (
    <ButtonItem
      title={t("sign-out")}
      icon={faRightFromBracket}
      onClick={async function handleSignOut() {
        await signOut();
        refreshUser();
        showSignOutSuccessToast();
      }}
    />
  );
}
