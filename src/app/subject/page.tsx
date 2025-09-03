"use client";

import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { useSubjects } from "@/hooks/use-subjects";
import PatternBackground from "@/components/PatternBackground";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { SubjectEdit } from "@/components/dialogs/subject-edit";

export default function SubjectsPage() {
    const router = useRouter();
    const {
        subjects,
        isLoading,
        error,
        deleteSubject,
    } = useSubjects();

    const onDelete = (subjectId: string) => {
        if (confirm("Dieses Fach wirklich löschen?")) {
            deleteSubject({ subjectId });
        }
    };

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-500">Fehler beim Laden der Fächer.</p>
                <Button className="mt-4" onClick={() => router.refresh()}>
                    Erneut versuchen
                </Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Fächer</h1>
                {/* Placeholder for future actions (e.g., create subject) */}
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
                <div className="text-muted-foreground">Keine Fächer vorhanden.</div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {subjects.map((s) => (
                        <Link href={`/subject/${s.id}`} key={s.id}>
                            <Card
                                role="button"
                                className="group overflow-hidden p-0"
                            >
                                <div className="relative h-24 w-full">
                                    <PatternBackground className="h-full w-full" color={s.color} />
                                </div>

                                <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-2 px-4 py-3">
                                    <CardTitle className="text-base">{s.name}</CardTitle>
                                    <CardAction>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => e.stopPropagation()}
                                                    aria-label="Aktionen"
                                                >
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <DropdownMenuItem
                                                    onClick={() => router.push(`/subject/${s.id}`)}
                                                    key="open"
                                                >
                                                    Öffnen
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                    <SubjectEdit subjectId={s.id}/>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    key="delete"
                                                    variant="destructive"
                                                    onClick={() => onDelete(s.id)}
                                                >
                                                    Löschen
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardAction>
                                </CardHeader>

                                <CardContent className="px-4 pb-4 text-sm text-muted-foreground"></CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
