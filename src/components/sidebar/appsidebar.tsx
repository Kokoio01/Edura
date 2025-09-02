"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar";
import {Home} from "lucide-react";
import {SidebarUser} from "@/components/sidebar/sidebar-user";
import {SidebarSubjects} from "@/components/sidebar/sidebar-subject";
import {useSession} from "@/lib/auth-client";

const items = [
    {
        title: "Home",
        url: "/",
        icon: Home
    }
]

export function AppSidebar() {
    const session = useSession()

    return (
        <Sidebar variant="inset">
            <SidebarHeader/>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Edura</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {session.data ? <SidebarSubjects/> : null}
            </SidebarContent>
            <SidebarFooter>
                <SidebarUser/>
            </SidebarFooter>
        </Sidebar>
    )
}