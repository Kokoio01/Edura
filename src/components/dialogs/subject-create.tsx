"use client";

import * as React from "react";
import { useSubjects } from "@/hooks/use-subjects";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import ColorSelector from "../ui/color-selector";
import { trpc } from "@/lib/trpc";
import {Plus} from "lucide-react";

export function SubjectCreate() {
    const { createSubject } = useSubjects();
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("")
    const [color, setColor] = React.useState("")
    const utils = trpc.useUtils();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createSubject({name: name, color: color})
        setOpen(false);
        utils.subject.getAll.invalidate();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Plus className="h-3 w-3"/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Fach erstellen</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="color-1">Frabe</Label>
                            <ColorSelector onChange={setColor}/>
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
}
