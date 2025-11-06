"use client";

import * as React from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import {useTranslations} from "next-intl";
import { apiKey } from "@/lib/auth-client";
import { Trash } from "lucide-react";

interface ApikeyDeleteProps {
  keyId: string;
  onSuccess?: () => void; // optionaler Callback nach erfolgreichem Löschen
}

export function ApikeyDelete({ keyId, onSuccess }: ApikeyDeleteProps) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const t = useTranslations("ApikeyDelete");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiKey.delete(
        { keyId },
        {
          onRequest: async () => {
            setLoading(true);
            setError("");
          },
          onResponse: async (ctx) => {
            setLoading(false);
            const cloned = ctx.response.clone();
            const json = await cloned.json();

            if (cloned.status === 200) {
              setOpen(false);
              if (onSuccess) onSuccess();
            } else {
              setError(json.message || "Failed to delete API key");
            }
          },
        }
      );
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" aria-label={t("delete")}>
          <Trash className="cursor-pointer" />
        </Button>
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
            <Button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white"
            >
              {t("delete")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

