"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar";
import {BookIcon, Cog, Home} from "lucide-react";
import {SidebarUser} from "@/components/sidebar/sidebar-user";
import {SidebarSubjects} from "@/components/sidebar/sidebar-subject";
import {useSession} from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";

export function SidebarApp() {
    const session = useSession()
    const router = useRouter();
    const t = useTranslations("Sidebar")

    const items = [
        {
            title: t("page_home"),
            url: "/",
            icon: Home
        },
        {
            title: t("page_subjects"),
            url: "/subject",
            icon: BookIcon
        },
        {
            title: t("page_settings"),
            url: "/settings",
            icon: Cog
        }
    ]

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
                                        <a onClick={() => router.push(item.url)}>
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