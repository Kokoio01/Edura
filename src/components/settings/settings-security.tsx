"use client";

import {useTranslations} from "next-intl";
import { Label } from "../ui/label";
import { ApikeyCreate } from "../dialogs/apikey-create";
import { apiKey } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { CheckCircle2Icon, Key } from "lucide-react";
import { Separator } from "../ui/separator";
import { ApikeyDelete } from "../dialogs/apikey-delete";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface ApiKey {
  id: string;
  key?: string;
  name: string | null;
  permissions: { [key: string]: string[] } | null;
  start: string | null;
  prefix: string | null;
  userId: string;
  refillInterval: number | null;
  refillAmount: number | null;
    metadata: Record<string, unknown> | null;
  // … weitere Felder, je nach API
}

export default function SettingsSecurity() {
    const t = useTranslations("SettingsPage");
    const [apikeys, setApikeys] = useState<ApiKey[]>([]);
    const [newkey, setNewKey] = useState("");

    const loadApiKeys = () => {
        apiKey.list().then(result => {
            if ('data' in result) {
                setApikeys(result.data ?? []);
            }
        }).catch(err => {
            console.error("Failed to load API keys:", err);
        });
    };

    useEffect(() => {
        loadApiKeys();
    }, []);


    return (
        <div className="space-y-6">
            <h1 className="text-xl py-4">{t("title_security")}</h1>

            {newkey ? 
            <Alert>
                <CheckCircle2Icon />
                <AlertTitle>
                    {t("success_newkey")}
                </AlertTitle>
                <AlertDescription>{newkey}</AlertDescription>
            </Alert> : null
            }

            <div className="flex flex-row items-center justify-between">
                <div className="grid gap-2">
                    <Label>{t("security_apikey_label")}</Label>
                </div>
                <ApikeyCreate onSuccess={(NEWKey) => {setNewKey(NEWKey); loadApiKeys();}}/>
            </div>

            <Separator/>

            {apikeys.map((apikey) => (
                <div className="flex flex-row items-center justify-between" key={apikey.id}>
                    <div className="flex flex-row gap-2">
                        <Key size={24}/>
                        <Label>{apikey.name}</Label>
                    </div>

                    <ApikeyDelete keyId={apikey.id} onSuccess={() => loadApiKeys()}/>
                </div>
            ))}
        </div>
    );
}

