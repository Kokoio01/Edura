"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useSubjects } from "@/hooks/use-subjects";
import {useTranslations} from "next-intl";
import { PlusCircle } from "lucide-react";
import {SidebarMenuButton} from "@/components/ui/sidebar";

interface HomeworkCreateProps {
    subjectId?: string;
    button?: "sidebar";
}

export function HomeworkCreate({ subjectId, button }: HomeworkCreateProps) {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [due, setDue] = React.useState<string>("");
    const [description, setDescription] = React.useState("");
    const [subject, setSubject] = React.useState(subjectId ?? "");
    const { subjects } = useSubjects();
    const utils = trpc.useUtils();
    const t = useTranslations("HomeworkCreate");

    const createMutation = trpc.homework.create.useMutation({
        onSuccess: () => {
            utils.homework.getAll.invalidate();
            setTitle("");
            setDue("");
            setDescription("");
            if (!subjectId) setSubject("");
            setOpen(false);
        },
    });

    const canSubmit =
        title.trim().length > 0 &&
        (subjectId ? true : subject.trim().length > 0) &&
        !createMutation.isPending;

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) return;
        createMutation.mutate({
            title: title.trim(),
            description: description.trim() ? description.trim() : undefined,
            dueDate: due ? new Date(due) : undefined,
            subjectId: subject,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {button === "sidebar" ? (
                    <Button variant="secondary">
                        <PlusCircle/>
                        {t("trigger_sidebar_create")}
                    </Button>
                ) : (
                    <Button variant="outline">{t("trigger_create")}</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="grid gap-4">
                    {!subjectId && (
                        <div className="grid gap-3">
                            <Label htmlFor="subject-1">{t("subject_label")}</Label>
                            <select
                                id="subject-1"
                                name="subject"
                                className="border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 block w-full rounded-md border px-3 py-2 text-sm"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            >
                                <option value="">{t("subject_placeholder")}</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid gap-3">
                        <Label htmlFor="title-1">{t("title_label")}</Label>
                        <Input id="title-1" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="duedate-1">{t("due_label")}</Label>
                        <Input
                            id="duedate-1"
                            name="duedate"
                            type="date"
                            value={due}
                            onChange={(e) => setDue(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="description-1">{t("description_label")}</Label>
                        <Textarea
                            id="description-1"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="pt-3">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                {t("cancel")}
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={!canSubmit}>
                            {createMutation.isPending ? t("submitting") : t("submit")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
