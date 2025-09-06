'use client';
import { useState, useEffect } from 'react';

export function useLocale(defaultLocale = 'en') {
    const [locale, setLocale] = useState(defaultLocale);

    useEffect(() => {
        const match = document.cookie.match(/LOCALE=([^;]+)/);
        if (match) setLocale(match[1]);
    }, []);

    const updateLocale = (newLocale: string) => {
        setLocale(newLocale);
        document.cookie = `LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
    };

    return { locale, setLocale: updateLocale };
}
