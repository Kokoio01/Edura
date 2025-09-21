"use client";

import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PatternBackground from "@/components/PatternBackground";
import { Calendar } from "lucide-react";
import { HomeworkTable } from "@/components/homework-table";
import { useSession } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import React from "react";
import {Separator} from "@/components/ui/separator";

export default function SubjectPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const user = useSession().data?.user;
    const t = useTranslations("SubjectPage");

    const {
        data: subject,
        isLoading: isSubjectLoading,
        error,
    } = trpc.subject.getById.useQuery(
        { subjectId: id?.toString() ?? "" },
        {
            enabled: !!user && id !== null,
            retry: (failureCount) => failureCount < 2,
        },
    );

    // Error handling
    if (id === null) {
        return (
            <div className="p-6">
                <p className="text-red-500">{t("invalid_id")}</p>
                <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                    {t("back_to_dashboard")}
                </Button>
            </div>
        );
    }

    if (isSubjectLoading) {
        return (
            <div className="min-h-screen">
                {/* Header Skeleton */}
                <div className="h-48 bg-muted animate-pulse rounded-b-2xl" />

                {/* Content Skeleton */}
                <div className="p-8 space-y-6">
                    <Skeleton className="h-12 w-80" />
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3 space-y-4">
                            <Skeleton className="h-8 w-40" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{t("load_error")}</p>
                    <Button onClick={() => router.refresh()}>
                        {t("retry")}
                    </Button>
                </div>
            </div>
        );
    }

    if (!subject) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">{t("not_found")}</p>
                    <Button onClick={() => router.push("/dashboard")}>
                        {t("back_to_dashboard")}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Compact Header with Pattern Background */}
            <header className="relative">
                <PatternBackground
                    className="h-32 w-full rounded-b-2xl"
                    color={subject.color}
                />

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/60 dark:from-black/100 to-transparent pointer-events-none rounded-b-xl" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold drop-shadow-lg">
                            {subject.name}
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Primary Content Area */}
                    <div className="lg:col-span-3">
                        <HomeworkTable subjectId={subject.id} />
                    </div>

                    {/* Sidebar */}
                    <Separator className="lg:hidden"/>
                    <aside className="flex flex-col lg:col-span-1 lg:pt-7">
                        <h2 className="text-lg font-bold mb-4">
                            {t("information")}
                        </h2>

                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4"/>
                                <span>
                                    {t("created")}: {subject.createdAt?.toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}