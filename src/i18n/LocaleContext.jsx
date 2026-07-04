import { createContext, useContext, useEffect, useState } from 'react';
import { resumeData as en } from '../data/resume.en';
import { resumeData as es } from '../data/resume.es';
import { variants } from '../data/variants';
import { labels } from './labels';

const locales = { en, es };
const LocaleContext = createContext(null);

// Variante de CV personalizada (?cv=<slug>), no listada en el sitio.
const activeVariant = variants[new URLSearchParams(window.location.search).get('cv')];

function initialLocale() {
  if (activeVariant) return activeVariant.locale;
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param === 'en' || param === 'es') return param;
  const stored = localStorage.getItem('lang');
  if (stored === 'en' || stored === 'es') return stored;
  // First browser-preferred language we support wins (navigator.languages
  // is the ordered Accept-Language list; language ≠ location, so no geo-IP).
  for (const lang of navigator.languages ?? [navigator.language]) {
    const base = lang?.slice(0, 2).toLowerCase();
    if (base === 'es' || base === 'en') return base;
  }
  return 'en';
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
      value={{
        locale,
        setLocale,
        data: activeVariant ? activeVariant.data : locales[locale],
        labels: labels[locale],
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
