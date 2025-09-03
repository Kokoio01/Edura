"use client";

import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PatternBackground from "@/components/PatternBackground";
import { Calendar } from "lucide-react";
import { HomeworkTable } from "@/components/homework-table";
import {useSession} from "@/lib/auth-client";

export default function SubjectPage() {
    const router = useRouter();
    const params = useParams();
    let errors = null;
    const { id } = params;

    const user = useSession().data?.user;

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

    if (id === null) {errors = "Ungültige Fach-ID."}

    if (errors) {
        return (
            <div className="p-6">
                <p className="text-red-500">{errors}</p>
                <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                    Zurück zum Dashboard
                </Button>
            </div>
        );
    }

    if (isSubjectLoading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-96" />
                <Skeleton className="h-4 w-64" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-500">Fehler beim Laden des Fachs.</p>
                <Button className="mt-4" onClick={() => router.refresh()}>
                    Erneut versuchen
                </Button>
            </div>
        );
    }

    if (!subject) {
        return (
            <div className="p-6">
                <p className="text-muted-foreground">Fach nicht gefunden.</p>
                <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                    Zurück zum Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            {/* Header with Pattern Background */}
            <div className="relative h-[33vh] w-full">
                <PatternBackground
                    className="h-full w-full rounded-b-2xl shadow-2xl"
                    color={subject.color}
                />
            </div>

            {/* Title Section */}
            <div className="overflow-auto px-8 py-8">
                <div className="mx-auto">
                    <h1 className="bg-gradient-to-r bg-clip-text text-6xl font-bold">
                        {subject.name}
                    </h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="shadow-inner">
                <div className="mx-auto px-8 pb-8">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                        <div className="flex-1 space-y-8">
                            <HomeworkTable subjectId={subject.id} />
                        </div>

                        {/* Metadata Sidebar */}
                        <div className="lg:w-80 space-y-6">
                            <div className="rounded-xl p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold">Information</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-200">
                                        <Calendar className="size-4" />
                                        <span>
                                          Erstellt: {subject.createdAt?.toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
