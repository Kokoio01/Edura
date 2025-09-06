"use client";

import * as React from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {useTranslations} from "next-intl";
import { admin } from "@/lib/auth-client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus } from "lucide-react";

export function UserCreate() {
    const [open, setOpen] = React.useState(false);

    const [email, setEmail] = React.useState("")
    const [name, setName] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [role, setRole] = React.useState("user" as "user" | "admin")
    const [error, setError] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const t = useTranslations("UserCreate");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await admin.createUser({
                email,
                name,
                password,
                role,
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
                    <Button>
                        <Plus className="size-4"/>
                        {t("trigger_create")}
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
                                <Label htmlFor="name-1">{t("name_label")}</Label>
                                <Input id="name-1" name="name" type="text" onChange={(e) => setName(e.target.value)}/>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="email-1">{t("email_label")}</Label>
                                <Input id="email-1" name="email" type="email" onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="password-1">{t("password_label")}</Label>
                                <Input id="password-1" name="password" type="password" onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="role-1">{t("role_label")}</Label>
                                <Select value={role} onValueChange={(value) => setRole(value as "user" | "admin")}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t("role_label")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 flex flex-row pt-3">
                            <DialogClose asChild>
                                <Button variant="outline">{t("cancel")}</Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>{t("create")}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
}
