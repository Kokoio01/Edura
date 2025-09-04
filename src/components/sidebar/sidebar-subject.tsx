"use client";
import {
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar";
import { useSubjects } from "@/hooks/use-subjects";
import Link from "next/link";
import {SubjectCreate} from "@/components/dialogs/subject-create";
import {useTranslations} from "next-intl";

export function SidebarSubjects() {
    const { subjects, error } = useSubjects();
    const t = useTranslations("Sidebar")

    // Show error state
    if (error) {
        return (
            <SidebarGroup>
                <SidebarGroupLabel>{t("category_subjects")}</SidebarGroupLabel>
                <SidebarMenuItem>
                    <div className="px-3 py-2 text-sm text-red-500">
                        {t("error_subjects")}
                    </div>
                </SidebarMenuItem>
            </SidebarGroup>
        );
    }

    // Show subjects list
    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                {t("category_subjects")}
                <SidebarGroupAction>
                    <div className="p-1 hover:bg-accent rounded">
                        <SubjectCreate/>
                    </div>
                </SidebarGroupAction>
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {subjects.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                            {t("no_subjects")}
                        </div>
                    ) : (
                        subjects.map((subject) => (
                            <SidebarMenuItem key={subject.id}>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={`/subject/${subject.id}`}
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className="rounded-full w-3 h-3 flex-shrink-0"
                                            style={{
                                                backgroundColor: `${subject.color}`,
                                            }}
                                        />
                                        <span className="truncate">{subject.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
