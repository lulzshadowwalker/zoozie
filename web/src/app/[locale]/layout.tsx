import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { IBaseLayoutParams } from "@types";
import { NextIntlClientProvider, useMessages } from "next-intl";

import { config } from "@fortawesome/fontawesome-svg-core";
import { config as i18nConfig } from "@/lib/i18n/config";
import { unstable_setRequestLocale } from "next-intl/server";

import "../globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-photo-view/dist/react-photo-view.css";
import "react-toastify/dist/ReactToastify.css";
import UserContextProvider from "@/lib/context/user";
import ClientSidePostHogProvider from "@/lib/posthog/providers";
import dynamic from "next/dynamic";
import ZoozieToast from "@/components/shared/zoozie-toast";

const PostHogPageView = dynamic(() => import("@/lib/posthog/page-view"), {
  ssr: false,
});

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zooz",
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params: { locale },
}: IBaseLayoutParams) {
  const messages = useMessages();
  unstable_setRequestLocale(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ClientSidePostHogProvider>
          <PostHogPageView />
          <UserContextProvider>
            <body className={inter.className}>
              <ZoozieToast />
              {children}
            </body>
          </UserContextProvider>
        </ClientSidePostHogProvider>
      </NextIntlClientProvider>
    </html>
  );
}
