import { createContext, useContext, useEffect, useState } from 'react';
import { resumeData as en } from '../data/resume.en';
import { resumeData as es } from '../data/resume.es';
import { labels } from './labels';

const locales = { en, es };
const LocaleContext = createContext(null);

function initialLocale() {
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param === 'en' || param === 'es') return param;
  const stored = localStorage.getItem('lang');
  if (stored === 'en' || stored === 'es') return stored;
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = labels[locale].pageTitle;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', labels[locale].metaDescription);
    localStorage.setItem('lang', locale);
  }, [locale]);

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, data: locales[locale], labels: labels[locale] }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
