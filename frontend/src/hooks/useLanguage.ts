import { startTransition, useCallback, useState } from 'react';
import en from '../i18n/en.json';
import th from '../i18n/th.json';
import type { TranslationMap } from '../types/i18n';

type Language = 'en' | 'th';

const STORAGE_KEY = 'erp.language';

const TRANSLATIONS: Record<Language, TranslationMap> = {
  en: en as TranslationMap,
  th: th as TranslationMap,
};

function readStoredLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'th') {
    return stored;
  }
  return 'en';
}

export function useLanguage(): {
  lang: Language;
  t: TranslationMap;
  setLang: (lang: Language) => void;
} {
  const [lang, setLangState] = useState<Language>(readStoredLanguage);

  const setLang = useCallback((newLang: Language) => {
    localStorage.setItem(STORAGE_KEY, newLang);
    startTransition(() => {
      setLangState(newLang);
    });
  }, []);

  return {
    lang,
    t: TRANSLATIONS[lang],
    setLang,
  };
}
