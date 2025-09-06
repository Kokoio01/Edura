"use client";

import * as React from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {useTranslations} from "next-intl";
import {changePassword} from "@/lib/auth-client";

export function PasswordEdit() {
    const [open, setOpen] = React.useState(false);
    const [oldPass, setOldPass] = React.useState("")
    const [newPass, setNewPass] = React.useState("")
    const [newPassConfirm, setNewPassConfirm] = React.useState("")
    const [error, setError] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const t = useTranslations("PasswordEdit");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newPass !== newPassConfirm) {
            setError(t("new_pass_confirm_error"))
            return
        }
        await changePassword({
                currentPassword: oldPass,
                newPassword: newPass,
                revokeOtherSessions: true,
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
                    <Button variant="outline" size="sm">
                        {t("trigger_edit")}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t("title")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={onSubmit} className="space-y-6">
                        {error && <div className="text-red-500">{error}</div>}
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="old-pass-1">{t("old_pass_label")}</Label>
                                <Input id="old-pass-1" name="old-pass" type="password" onChange={(e) => setOldPass(e.target.value)}/>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="new-pass-1">{t("new_pass_label")}</Label>
                                <Input id="new-pass-1" name="new-pass" type="password" onChange={(e) => setNewPass(e.target.value)}/>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="nnew-pass-confirm-1">{t("new_pass_confirm_label")}</Label>
                                <Input id="new-pass-confirm-1" name="new-pass-confirm" type="password" onChange={(e) => setNewPassConfirm(e.target.value)}/>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 flex flex-row pt-3">
                            <DialogClose asChild>
                                <Button variant="outline">{t("cancel")}</Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>{t("save")}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
}
