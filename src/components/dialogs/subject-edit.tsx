"use client";

import * as React from "react";
import { useSubjects } from "@/hooks/use-subjects";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import ColorSelector from "../ui/color-selector";
import { trpc } from "@/lib/trpc";
import {useTranslations} from "next-intl";

interface SubjectEditProps {
    subjectId: string;
}

export function SubjectEdit({ subjectId }: SubjectEditProps) {
    const { subjects, updateSubject } = useSubjects();
    const s = subjects.find(s => s.id === subjectId)
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState(s?.name)
    const [color, setColor] = React.useState(s?.color)
    const t = useTranslations("SubjectEdit");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (s) {
            updateSubject({subjectId: s.id, name: name, color: color});
            setOpen(false);
        }
    }

    if (s) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <a>{t("trigger_edit")}</a>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t("title")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name-1">{t("name_label")}</Label>
                                <Input id="name-1" name="name" onChange={(e) => setName(e.target.value)} defaultValue={s.name}/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="color-1">{t("color_label")}</Label>
                                <ColorSelector onChange={setColor} initialColor={s.color}/>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 flex flex-row pt-3">
                            <DialogClose asChild>
                                <Button variant="outline">{t("cancel")}</Button>
                            </DialogClose>
                            <Button type="submit">{t("save")}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    } else {
        return (
            <Dialog>
                <form>
                    <DialogTrigger asChild>
                        <a>{t("trigger_edit")}</a>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{t("not_found")}</DialogTitle>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">{t("cancel")}</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        );
    }
}
