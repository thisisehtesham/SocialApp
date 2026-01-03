import en from '@/i18n/en.json';
import hi from '@/i18n/hi.json';

export const dictionaries = {
  en,
  hi,
};

export function getDictionary(locale) {
  return dictionaries[locale] || en;
}
