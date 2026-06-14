"use client";
import { usePathname } from "next/navigation";
import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({ items }) {
    const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
const isActive =
  item.url === "/dashboard"
    ? pathname === "/dashboard"
    : pathname.startsWith(item.url);

  return (
    <SidebarMenuItem
      key={item.title}
      className={`cursor-pointer! transition-all duration-200 rounded-lg ${
        isActive
          ? "bg-accent text-primary font-semibold"
          : "hover:bg-muted"
      }`}
    >
      <Link href={item.url} className="cursor-pointer!">
        <SidebarMenuButton
          tooltip={item.title}
          className="flex items-center gap-2 text-lg cursor-pointer!"
        >
          {item.icon && (
            <item.icon
              className={`h-5 w-5 ${
                isActive ? "text-primary" : ""
              }`}
            />
          )}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
})}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
