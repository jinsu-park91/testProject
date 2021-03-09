import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

const i18n = i18next.createInstance();
i18n
  .use(Backend)
  .use(initReactI18next)
  .init(
    {
      debug: false,
      lng: 'ko',
      fallbackLng: 'en',
      ns: ['translation'],
      defaultNS: 'translation',
      keySeparator: false,
      interpolation: { escapeValue: false },
      backend: {
        loadPath: `/locales/{{lng}}/{{ns}}.json`,
      },
      react: {
        useSuspense: false,
      },
    },
    (err, t) => {
      if (err) return console.log(err);
    },
  );

export default i18n;
