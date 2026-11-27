import { useState, useEffect, useCallback } from 'react';
import { LanguageContext } from './languageContextObject';
import { TRANSLATIONS } from '../i18n/translations';

const LANG_KEY = 'gurvista_lang';

function readInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore storage failure
    }
  }, [lang]);

  const setLang = useCallback((nextLang) => {
    setLangState(nextLang === 'hi' ? 'hi' : 'en');
  }, []);

  const t = useCallback(
    (path) => {
      const parts = path.split('.');
      let node = TRANSLATIONS[lang];
      for (const part of parts) {
        if (node && typeof node === 'object' && part in node) {
          node = node[part];
        } else {
          node = undefined;
          break;
        }
      }
      if (node !== undefined) return node;

      let fallback = TRANSLATIONS.en;
      for (const part of parts) {
        if (fallback && typeof fallback === 'object' && part in fallback) {
          fallback = fallback[part];
        } else {
          return path;
        }
      }
      return fallback;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isHindi: lang === 'hi' }}>
      {children}
    </LanguageContext.Provider>
  );
}
