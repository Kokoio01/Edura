"use client";

import UserTable from "../users-table";
import { useTranslations } from "next-intl";

export default function AdminUsers() {
    const t = useTranslations("SettingsPage");

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold">{t("title_users")}</h1>
            <UserTable />
        </div>
    );
}
