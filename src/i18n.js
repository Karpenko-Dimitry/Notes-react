import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n.use(HttpApi) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false,
        fallbackLng: 'en',

        // order and from where user language should be detected
        order: ['localStorage'],

        // keys or params to lookup language from
        lookupLocalStorage: 'locale',
        // cache user language on
        caches: ['localStorage', 'cookie'],
        excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

        supportedLngs: ['en', 'ru'],

        backend: {
            loadPath: `http://notes.com/api/locales/{{lng}}/{{ns}}`,
            allowMultiLoading: false,
            crossDomain: false,
        },

        react: {
            wait: true,
            bindI18n: 'languageChanged',
        },

        keySeparator: false, // we do not use keys in form messages.welcome
    });

export default i18n;
