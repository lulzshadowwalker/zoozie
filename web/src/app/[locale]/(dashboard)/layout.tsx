import SideNavigationBar from "@/components/dashboard/side-navigation-bar";
import { IBaseLayoutParams } from "@/lib/types/types";

// TODO: these pages should probably not be crawled don't you think ? 

export default function AgencyLayout({ children }: IBaseLayoutParams) {
  return (
    <>
      <SideNavigationBar />
      {children}
    </>
  );
}
