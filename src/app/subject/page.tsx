"use client";

import { useRouter } from "next/navigation";
import { useSubjects } from "@/hooks/use-subjects";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {useTranslations} from "next-intl";
import SubjectCard from "@/components/subject-card";
import {SubjectCreate} from "@/components/dialogs/subject-create";

export default function SubjectsPage() {
    const router = useRouter();
    const {
        subjects,
        isLoading,
        error,
    } = useSubjects();
    const t = useTranslations("SubjectsPage");

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-500">{t("load_error")}</p>
                <Button className="mt-4" onClick={() => router.refresh()}>
                    {t("retry")}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{t("title")}</h1>
                <SubjectCreate button="big"/>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-xl border">
                            <Skeleton className="h-24 w-full rounded-t-xl" />
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-5 w-1/2" />
                                <Skeleton className="h-4 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : subjects.length === 0 ? (
                <div className="text-muted-foreground">{t("empty")}</div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {subjects.map((s) => (
                        <SubjectCard key={s.id} id={s.id} color={s.color} name={s.name} />
                    ))}
                </div>
            )}
        </div>
    );
}
