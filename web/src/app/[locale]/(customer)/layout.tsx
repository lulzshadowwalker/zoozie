import Footer from "@/components/customer/shared/footer";
import HeaderNavigationBar from "@/components/customer/shared/header-navigation-bar";
import { ReactNode } from "react";
import Chat from "@/components/customer/shared/chat";

export const metadata = {
  title: "Zoozie | Your home away from home",
  description:
    "Find a home away from home with Zooz and get started today! We'll help you find your perfect home.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HeaderNavigationBar />
        <div className="mx-auto max-w-supported">{children}</div>
        <Chat />
        <Footer />
      </body>
    </html>
  );
}
