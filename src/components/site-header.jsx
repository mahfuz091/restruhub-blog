import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header>
      <SidebarTrigger className="-ml-1 md:hidden" />
    </header>
  );
}
