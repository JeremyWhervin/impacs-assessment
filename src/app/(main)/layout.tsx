"use client";

import React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const MainLayout = ({ children }:{ children:React.ReactNode }) => {
  return (
    <SidebarProvider>
        <AppSidebar />
        <main className="h-screen flex flex-col items-center w-full">      
            {children}
        </main> 
    </SidebarProvider>
            
  )
}

export default MainLayout