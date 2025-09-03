"use client"

import {useRouter} from "next/navigation"
import {useSubjects} from "@/hooks/use-subjects"
import PatternBackground from "@/components/PatternBackground"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Skeleton} from "@/components/ui/skeleton"
import {HomeworkTable} from "./homework-table"
import {BookOpen, Calendar, Plus} from "lucide-react"
import {useSession} from "@/lib/auth-client";

interface Subject {
    id: string
    name: string
    color: string
}

export function DashboardClient() {
    const router = useRouter()
    const user = useSession().data?.user;
    const {subjects, isLoading: subjectsLoading, error: subjectsError} = useSubjects()

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

    const EmptyState = () => (
        <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4"/>
                <h3 className="font-semibold text-lg mb-2">Noch keine Fächer</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    Lege deine ersten Fächer an, um mit der Organisation zu beginnen.
                </p>
                <Button onClick={() => router.push("/subject")} className="gap-2">
                    <Plus className="h-4 w-4"/>
                    Fach hinzufügen
                </Button>
            </CardContent>
        </Card>
    )

    const ErrorState = () => (
        <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-8 text-center">
                <p className="text-destructive font-medium">
                    Fehler beim Laden der Fächer
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                    Bitte versuche es später erneut
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                >
                    Erneut versuchen
                </Button>
            </CardContent>
        </Card>
    )

    const SubjectCard = ({subject}: { subject: Subject }) => (
        <Card
            key={subject.id}
            role="button"
            onClick={() => router.push(`/subject/${subject.id}`)}
            className="group overflow-hidden p-0 transition-all duration-200 hover:shadow-md cursor-pointer"
        >
            <div className="relative h-24 w-full">
                <PatternBackground className="h-full w-full" color={subject.color}/>
            </div>

            <CardHeader className="px-4 py-3">
                <CardTitle className="text-base">{subject.name}</CardTitle>
            </CardHeader>
        </Card>
    )

    const renderSubjectsContent = () => {
        if (subjectsLoading) return <LoadingSkeleton/>
        if (subjectsError) return <ErrorState/>
        if (subjects.length === 0) return <EmptyState/>

        return (
            <div className="grid grid-cols-1 gap-4">
                {subjects.map((subject: Subject) => (
                    <SubjectCard key={subject.id} subject={subject}/>
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
                        👋 Willkommen, {user?.name || "Schüler"}!
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Hier ist deine persönliche Übersicht für heute.
                    </p>
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
                                    <h2 className="text-2xl font-semibold">Hausaufgaben</h2>
                                </div>
                            </div>
                        </div>
                        <HomeworkTable/>
                    </div>

                    {/* Subjects Section */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-primary"/>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold">Fächer</h2>
                                </div>
                            </div>
                            {subjects.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push("/subject")}
                                    className="gap-2"
                                >
                                    Alle anzeigen
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