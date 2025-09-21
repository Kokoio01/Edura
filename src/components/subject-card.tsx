import React from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import PatternBackground from "./PatternBackground";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { SubjectEdit } from "./dialogs/subject-edit";
import { useTranslations } from "next-intl";
import { useSubjects } from "@/hooks/use-subjects";
import {useRouter} from "next/navigation";

interface SubjectCardProps {
    id: string;
    color?: string;
    name: string;
}

export default function SubjectCard({ id, color = "#6ee7b7", name }: SubjectCardProps) {
    const {
        deleteSubject,
    } = useSubjects();
    const t = useTranslations("SubjectCard");
    const router = useRouter();

    const onDelete = (subjectId: string) => {
        if (confirm(t("confirm_delete"))) {
            deleteSubject({ subjectId });
        }
    };

    return (
        <Link href={`/subject/${id}`}>
            <div className="relative rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-2xl">
                <PatternBackground
                    className="h-36 w-full rounded-xl"
                    color={color}
                />
                <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-white/90 dark:from-black/90 to-transparent pointer-events-none rounded-b-xl" />
                <div className="absolute inset-x-0 bottom-0 flex flex-row justify-between items-end p-4 h-16">
                        <span className="text-lg font-semibold drop-shadow-sm">
                            {name}
                        </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <MoreVertical size={18}/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DropdownMenuItem
                                onClick={() => router.push(`/subject/${id}`)}
                                key="open"
                            >
                                {t("open")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <SubjectEdit subjectId={id}/>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                key="delete"
                                variant="destructive"
                                onClick={() => onDelete(id)}
                            >
                                {t("delete")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Link>
    );
}