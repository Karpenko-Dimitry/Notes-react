import React, { createContext, useMemo, useState } from 'react';

import { FALLBACK_LOCALE } from '../env';
import { LOCALES } from '../env';

const LocaleContext = createContext();

const LocaleProvider = ({ children }) => {
    const locales = LOCALES.split(',');
    const [currentLocale, setCurrentLocale] = useState(FALLBACK_LOCALE);

    const localeAction = useMemo(() => {
        return {
            set: (locale) => {
                if (locales.includes(locale)) {
                    localStorage.setItem('locale', locale);
                    setCurrentLocale(locale);
                } else {
                    localStorage.setItem('locale', FALLBACK_LOCALE);
                    setCurrentLocale(FALLBACK_LOCALE);
                }
            },
            get: () => currentLocale,
            restore: () => {
                setCurrentLocale(localStorage.getItem('locale'));
            },
        };
    }, [currentLocale, locales]);

    return <LocaleContext.Provider value={localeAction}>{children}</LocaleContext.Provider>;
};

export { LocaleContext, LocaleProvider };
