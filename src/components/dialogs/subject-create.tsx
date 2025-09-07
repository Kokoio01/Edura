"use client";

import * as React from "react";
import { useSubjects } from "@/hooks/use-subjects";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import ColorSelector from "../ui/color-selector";
import {Plus} from "lucide-react";
import {useTranslations} from "next-intl";

export function SubjectCreate() {
    const { createSubject } = useSubjects();
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("")
    const [color, setColor] = React.useState("")
    const t = useTranslations("SubjectCreate");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createSubject({name: name, color: color})
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Plus className="h-3 w-3"/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">{t("name_label")}</Label>
                            <Input id="name-1" name="name" onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="color-1">{t("color_label")}</Label>
                            <ColorSelector onChange={setColor}/>
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
}
