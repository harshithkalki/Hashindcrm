import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources: Record<string, { translation: Record<string, string> }> = {
  en: {
    translation: require('./public/locales/en/common.json'),
  },
  fr: {
    translation: require('./public/locales/fr/common.json'),
  },
  // Add translations for other languages
};

// i18next initialization
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Set the default language
  interpolation: {
    escapeValue: false, // React already escapes the values
  },
});

export default i18n;
