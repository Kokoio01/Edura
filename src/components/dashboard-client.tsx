"use client"

import {useRouter} from "next/navigation"
import {useSubjects} from "@/hooks/use-subjects"
import {Card, CardContent, CardHeader } from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Skeleton} from "@/components/ui/skeleton"
import {HomeworkTable} from "./homework-table"
import {BookOpen, Calendar, Plus} from "lucide-react"
import {useSession} from "@/lib/auth-client";
import {useTranslations} from "next-intl";
import SubjectCard from "./subject-card"
import {SubjectCreate} from "@/components/dialogs/subject-create";

interface Subject {
    id: string
    name: string
    color: string
}

export function DashboardClient() {
    const router = useRouter()
    const user = useSession().data?.user;
    const {subjects, isLoading: subjectsLoading, error: subjectsError} = useSubjects()
    const t = useTranslations("Dashboard");

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 gap-4">
            {Array.from({length: 4}).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <div className="relative">
                        <Skeleton className="h-16 w-full"/>
                    </div>
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-5 w-2/3"/>
                        <Skeleton className="h-4 w-1/2"/>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )

    const EmptyState = () => <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4"/>
            <h3 className="font-semibold text-lg mb-2">{t("empty_title")}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">{t("empty_description")}</p>
            <SubjectCreate button="big"/>
        </CardContent>
    </Card>

    const ErrorState = () => (
        <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-8 text-center">
                <p className="text-destructive font-medium">{t("error_title")}</p>
                <p className="text-muted-foreground text-sm mt-2">{t("error_description")}</p>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                >
                    {t("error_retry")}
                </Button>
            </CardContent>
        </Card>
    )

    const renderSubjectsContent = () => {
        if (subjectsLoading) return <LoadingSkeleton/>
        if (subjectsError) return <ErrorState/>
        if (subjects.length === 0) return <EmptyState/>

        return (
            <div className="grid grid-cols-1 gap-4">
                {subjects.map((s: Subject) => (
                    <SubjectCard key={s.id} id={s.id} color={s.color} name={s.name} />
                ))}
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full">
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Welcome Section */}
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl font-bold bg-clip-text mb-2">
                        {t("welcome", { name: user?.name ?? t("student") })}
                    </h1>
                    <p className="text-muted-foreground text-lg">{t("overview_for_today")}</p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-12">
                    {/* Homework Section */}
                    <div className="col-span-12 lg:col-span-8 space-y-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Calendar className="h-5 w-5 text-primary"/>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold">{t("homework_title")}</h2>
                                </div>
                            </div>
                        </div>
                        <HomeworkTable showSubjects={true}/>
                    </div>

                    {/* Subjects Section */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-primary"/>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold">{t("subjects_title")}</h2>
                                </div>
                            </div>
                            {subjects.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push("/subject")}
                                    className="gap-2"
                                >
                                    {t("subjects_view_all")}
                                </Button>
                            )}
                        </div>
                        {renderSubjectsContent()}
                    </div>
                </div>
            </div>
        </div>
    )
}