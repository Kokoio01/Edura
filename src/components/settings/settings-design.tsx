"use client";

import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {useTranslations} from "next-intl";
import {useTheme} from "next-themes";
import {Computer, Moon, Sun} from "lucide-react";

export default function SettingsDesign() {
    const { setTheme, theme } = useTheme()
    const t = useTranslations("SettingsPage")

    const Themes = [
        { id: "light", name: t("theme_light"), icon: Sun },
        { id: "dark", name: t("theme_dark"), icon: Moon },
        { id: "system", name: t("theme_system"), icon: Computer},
    ];

    return (
        <div>
            <h1 className="text-xl py-4">{t("title_design")}</h1>

            <RadioGroup
                value={theme}
                onValueChange={(value) => {setTheme(value);}}
            >
                {Themes.map((theme) => (
                    <label
                        key={theme.id}
                        htmlFor={theme.id}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"
                    >
                        <RadioGroupItem value={theme.id} id={theme.id} />
                        <theme.icon/>
                        <span className="text-base font-medium">{theme.name}</span>
                    </label>
                ))}
            </RadioGroup>
        </div>
    );
}

