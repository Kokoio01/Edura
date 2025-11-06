"use client";

import * as React from "react";
import { useSubjects } from "@/hooks/use-subjects";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {Plus} from "lucide-react";
import {useTranslations} from "next-intl";
import { apiKey } from "@/lib/auth-client";

interface ApikeyCreateProps {
  onSuccess?: (newKey: string) => void;
}

export function ApikeyCreate({ onSuccess }: ApikeyCreateProps) {
  const [open, setOpen] = React.useState(false);
  const [desc, setDesc] = React.useState("");
  const t = useTranslations("ApikeyCreate");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let newkey = await apiKey.create({ name: desc });
      setOpen(false);
      setDesc("");
      if (onSuccess) onSuccess(newkey.data?.key ?? "Error");
    } catch (err) {
      console.error("Failed to create API key:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4"/>
          {t("create_button")}
        </Button> 
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="desc-1">{t("desc_label")}</Label>
              <Input
                id="desc-1"
                name="desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
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

