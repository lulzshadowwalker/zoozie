"use client";

import SideNavigationBar from "@/components/dashboard/side-navigation-bar";
import CreateListingProvider from "@/lib/context/create-listing";
import { IBaseLayoutParams } from "@types";

// TODO: these pages should probably not be crawled don't you think ?

export default function AgencyLayout({ children }: IBaseLayoutParams) {
  return (
    <CreateListingProvider>
      <SideNavigationBar />
      <div className="ms-[8rem]">{children}</div>
    </CreateListingProvider>
  );
}
