import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import translation_EN from "./Languages/en/en.json";
import translation_AR from "./Languages/ar/ar.json";

const defaultLanguage = "en";
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // lng : defaultLanguage,
    fallbackLng: defaultLanguage,
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: translation_EN,
      },
      ar: {
        translation: translation_AR,
      },
    },
    detection: {
      order: ["localStorage"],
      lookupLocalStorage: "inqLng",
      // caches: ['localStorage'],
      //   checkWhitelist: true,
      //   checkForSimilarInWhitelist: true,
      // Function to format the language code
      // lookupFromNavigatorDetector: function(detector) {
      //   let lang = detector.userLanguage || detector.language;
      //   return lang.split('-')[0];
      // },
    },
  });

// Check if there is no language set in localStorage then set the default language
// if (!localStorage.lang) {
//   i18n.changeLanguage(defaultLanguage);
// }

export default i18n;
