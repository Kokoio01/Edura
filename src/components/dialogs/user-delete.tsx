"use client";

import * as React from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import {useTranslations} from "next-intl";
import { admin } from "@/lib/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";

interface UserDeleteProps {
    userId: string;
}

export function UserDelete({userId}: UserDeleteProps) {
    const [open, setOpen] = React.useState(false);

    const [error, setError] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const t = useTranslations("UserDelete");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await admin.removeUser({
                userId,
            },
            {
                onRequest: async () => {
                    setLoading(true);
                    setError("");
                },
                onResponse: async (ctx) => {
                    setLoading(false);
                    const cloned = ctx.response.clone();
                    const json = await cloned.json();
                    setError(json.message);
                    if (cloned.status === 200) {
                        setOpen(false);
                    }
                },
            }
        );
    }

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <a className="text-red-500">{t("trigger_delete")}</a>
                    </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t("title")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={onSubmit} className="space-y-6">
                        {error && <div className="text-red-500">{error}</div>}
                        <DialogFooter className="gap-2 flex flex-row pt-3">
                            <DialogClose asChild>
                                <Button variant="outline">{t("cancel")}</Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading} style={{backgroundColor: "red", color: "white"}}>{t("delete")}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
}

