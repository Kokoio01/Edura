'use client'
import {Brush, Lock, Globe, User, Users} from "lucide-react";
import { useState } from "react";
import {useTranslations} from "next-intl";
import SettingsAccount from "@/components/settings/settings-account";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useSession} from "@/lib/auth-client";
import {Separator} from "@/components/ui/separator";
import SettingsLanguage from "@/components/settings/settings-language";
import SettingsDesign from "@/components/settings/settings-design";
import AdminUsers from "@/components/settings/admin-users";
import SettingsSecurity from "@/components/settings/settings-security";

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .join("");
}

export default function SettingsPage() {
    const [page, setPage] = useState("account");
    const t = useTranslations("SettingsPage")
    const session = useSession()
    const user = session.data?.user;

    if (!user) {
        return <h1>You are not logged in</h1>
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-start">
                <div className="lg:w-50 space-y-3 mx-10 mt-10">
                    <div className="flex items-center gap-2">
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
                    </div>
                    <Separator className="my-4"/>
                    <li className="flex items-center gap-4" onClick={() => setPage("account")}>
                        <User className="size-4"/>
                        <span>{t("tab_account")}</span>
                    </li>
                    <li className="flex items-center gap-4" onClick={() => setPage("security")}>
                        <Lock className="size-4"/>
                        <span>{t("tab_security")}</span>
                    </li>
                    <li className="flex items-center gap-4" onClick={() => setPage("design")}>
                        <Brush className="size-4"/>
                        <span>{t("tab_design")}</span>
                    </li>
                    <li className="flex items-center gap-4" onClick={() => setPage("language")}>
                        <Globe className="size-4"/>
                        <span>{t("tab_language")}</span>
                    </li>
                    {user.role === "admin" ?
                    <div>
                        <Separator className="my-4"/>
                        <li className="flex items-center gap-4" onClick={() => setPage("admin_users")}>
                            <Users className="size-4"/>
                            <span>{t("admin_users")}</span>
                        </li>
                    </div> : null}
                </div>

                <div className="flex-1 space-y-8 m-10">
                    {(() => {
                        switch (page) {
                            case "account":
                                return <SettingsAccount/>;
                            case "security":
                                return <SettingsSecurity/>;
                            case "design":
                                return <SettingsDesign/>;
                            case "language":
                                return <SettingsLanguage/>;
                            case "admin_users":
                                return <AdminUsers/>;
                            default:
                                return <h1>Willkommen in den Einstellungen</h1>;
                        }
                    })()}
                </div>
            </div>
        </div>
    )
}
