import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function Page({ children }) {
  const session = await auth();

  
  if (!session) {
    redirect("/");
  }

  return (
    <SidebarProvider className=' '>
      <AppSidebar variant='inset' session={session} />
      <SidebarInset>
        <SiteHeader />
        <div className='-mt-2'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
