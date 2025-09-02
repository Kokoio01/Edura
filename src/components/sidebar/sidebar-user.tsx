'use client'
import {useSession} from "@/lib/auth-client";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {ChevronsUpDown, LogInIcon} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useIsMobile} from "@/hooks/use-mobile";
import {signOut} from "@/lib/auth-client";
import {router} from "next/client";

export function SidebarUser() {
    const isMob = useIsMobile();
    const session = useSession()
    const user = session.data?.user;

    function getInitials(name: string) {
        return name
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0].toUpperCase())
            .join("");
    }

    async function logOut() {
        await signOut()
        router.push("/");
    }

    if (!user) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg"
                                       onClick={() =>
                                           (window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`)
                                       }>
                        <LogInIcon/>
                        <span>Log in</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg grayscale">
                                <AvatarImage src={user.image ? user.image : ""} alt={user.name}/>
                                <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="text-muted-foreground truncate text-xs">
                                  {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side={isMob ? "top" : "right"}>
                        <DropdownMenuItem onClick={logOut}>
                            Log Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}