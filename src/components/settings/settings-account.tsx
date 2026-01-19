"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUser, useSession } from "@/lib/auth-client";
import { useState } from "react";
import { PasswordEdit } from "@/components/dialogs/password-edit";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export default function SettingsAccount() {
  const session = useSession();
  const user = session.data?.user;

  const t = useTranslations("SettingsPage");
  const name = user?.name;
  const email = user?.email;

  const [loading, setLoading] = useState(false);

  async function changeName(name: string) {
    await updateUser(
      {
        name: name,
      },
      {
        onRequest: async () => {
          setLoading(true);
        },
        onResponse: async (ctx) => {
          setLoading(false);
          const cloned = ctx.response.clone();
          if (cloned.status === 200) {
            toast.success(t("name_changed_success"));
          }
        },
      },
    );
  }

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="py-4 text-xl">{t("title_account")}</h1>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 rounded-lg">
          <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
          <AvatarFallback className="rounded-lg">
            {getInitials(user.name ?? "U")}
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-2">
          <Label htmlFor="name">{t("account_name_label")}</Label>
          <Input
            id="name"
            defaultValue={name}
            onBlur={(e) => changeName(e.target.value)}
            disabled={loading}
            placeholder="Your name"
          />
        </div>
      </div>

      <Separator />

      <div className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <Label htmlFor="email">{t("account_email_label")}</Label>
          <p className="text-muted-foreground">{email}</p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <Label htmlFor="email">{t("account_password_label")}</Label>
        </div>
        <PasswordEdit />
      </div>
    </div>
  );
}
