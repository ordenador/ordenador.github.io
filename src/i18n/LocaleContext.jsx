import { createContext, useContext, useEffect, useState } from 'react';
import { resumeData as en } from '../data/resume.en';
import { resumeData as es } from '../data/resume.es';
import { variants } from '../data/variants';
import { labels } from './labels';
import { localizedPages } from '../../site.config.mjs';

const locales = { en, es };
const LocaleContext = createContext(null);

export function LocaleProvider({ children, locale = 'es', variant }) {
  const [suffix, setSuffix] = useState('');
  useEffect(() => {
    function updateSuffix() {
      const params = new URLSearchParams(window.location.search);
      params.delete('lang');
      // A language link opens the official CV. Personalized variants have their
      // own fixed locale; do not relabel Spanish variant data as English.
      params.delete('cv');
      setSuffix(`${params.size ? `?${params}` : ''}${window.location.hash}`);
    }
    updateSuffix();
    window.addEventListener('hashchange', updateSuffix);
    window.addEventListener('popstate', updateSuffix);
    return () => {
      window.removeEventListener('hashchange', updateSuffix);
      window.removeEventListener('popstate', updateSuffix);
    };
  }, []);
  const activeVariant = Object.hasOwn(variants, variant) ? variants[variant] : undefined;
  const activeLocale = activeVariant?.locale ?? locale;
  return (
    <LocaleContext.Provider
      value={{
        locale: activeLocale,
        data: activeVariant?.data ?? locales[activeLocale],
        labels: labels[activeLocale],
        languageHref: (lang) => localizedPages[lang].path + suffix,
        variant,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
