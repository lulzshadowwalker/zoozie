import SideNavigationBar from "@/components/dashboard/side-navigation-bar";
import { authenticate } from "@/lib/auth";
import { redirect } from "@/lib/i18n/navigation";
import { IBaseAgencyLayoutParams, IBaseLayoutParams } from "@types";
import { cookies } from "next/headers";

// TODO: these pages should probably not be crawled don't you think ?

export default async function AgencyLayout({
  children,
}: IBaseAgencyLayoutParams) {
  return (
    <>
      <SideNavigationBar />
      <div className="ms-[8rem]">{children}</div>
    </>
  );
}
