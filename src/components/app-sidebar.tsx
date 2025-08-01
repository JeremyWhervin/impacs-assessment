"use client"

import {
  Sidebar,
  SidebarMenu,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar"
import { Home, Inbox } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Customer Management",
    url: "/customer-management",
    icon: Inbox,
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader><p className="font-medium">Big Toy Maker</p></SidebarHeader>
      <SidebarContent>
         <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <span>Log out</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

            </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}