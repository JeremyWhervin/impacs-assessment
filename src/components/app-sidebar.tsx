"use client"
import LogoutButton  from './logout-button'
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
import { Home, Inbox, Shapes } from "lucide-react"
import { usePathname } from "next/navigation"

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

  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className='flex gap-1'>
          <Shapes />
           <p className="font-medium">Big Toy Maker</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
         <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild
                    isActive={item.url ? pathname === item.url : false}
                    className={
                    pathname === item.url
                      ? "" 
                      : "text-muted-foreground"
                      }>
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
                    <LogoutButton />
                  </SidebarMenuButton>
                </SidebarMenuItem>

            </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}