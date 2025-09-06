"use client";

import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {useLocale} from "@/hooks/use-locale";
import {useTranslations} from "next-intl";

const LANGUAGES = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

export default function SettingsLanguage() {
    const { locale, setLocale } = useLocale();
    const t = useTranslations("SettingsPage");

    return (
        <div>
            <h1 className="text-xl py-4">{t("title_language")}</h1>

            <RadioGroup
                value={locale}
                onValueChange={(value) => {setLocale(value); document.location.reload()}}
            >
                {LANGUAGES.map((lang) => (
                    <label
                        key={lang.code}
                        htmlFor={lang.code}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"
                    >
                        <RadioGroupItem value={lang.code} id={lang.code} />
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-base font-medium">{lang.name}</span>
                    </label>
                ))}
            </RadioGroup>
        </div>
    );
}

