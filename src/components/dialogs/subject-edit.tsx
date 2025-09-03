"use client";

import * as React from "react";
import { useSubjects } from "@/hooks/use-subjects";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import ColorSelector from "../ui/color-selector";
import { trpc } from "@/lib/trpc";

interface SubjectEditProps {
    subjectId: string;
}

export function SubjectEdit({ subjectId }: SubjectEditProps) {
    const { subjects, updateSubject } = useSubjects();
    const s = subjects.find(s => s.id === subjectId)
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState(s?.name)
    const [color, setColor] = React.useState(s?.color)
    const utils = trpc.useUtils();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (s) {
            updateSubject({subjectId: s.id, name: name, color: color});
            setOpen(false);
            utils.subject.getAll.invalidate();
        }
    }

    if (s) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <a>Bearbeiten</a>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Fach bearbeiten</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name-1">Name</Label>
                                <Input id="name-1" name="name" onChange={(e) => setName(e.target.value)} defaultValue={s.name}/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="color-1">Frabe</Label>
                                <ColorSelector onChange={setColor} initialColor={s.color}/>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 flex flex-row pt-3">
                            <DialogClose asChild>
                                <Button variant="outline">Abbrechen</Button>
                            </DialogClose>
                            <Button type="submit">Speichern</Button>
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
                        <a>Bearbeiten</a>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>404 - Fach nicht gefunden</DialogTitle>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        );
    }
}
