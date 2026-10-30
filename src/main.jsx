import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { LocaleProvider } from './i18n/LocaleContext';
import { labels } from './i18n/labels';
import { variants } from './data/variants';
import { localeFromPath, localizedPages } from '../site.config.mjs';
import { initializeAnalytics } from './analytics';
import './styles/main.css';
import { installPrintLayout } from './print-layout';

const params = new URLSearchParams(location.search);
const variantSlug = params.get('cv');
const variant = Object.hasOwn(variants, variantSlug) ? variantSlug : undefined;
const legacyLocale = params.get('lang');
const isFile = location.protocol === 'file:';
const pathLocale = localeFromPath(location.pathname);
const locale = variant
  ? variants[variant].locale
  : legacyLocale === 'en' || legacyLocale === 'es'
    ? legacyLocale
    : pathLocale;

// Keep old shared URLs working. The document at the canonical path supplies
// the matching static HTML before React hydrates it. Keep unrelated params/hash.
if (!isFile && !variant && (legacyLocale === 'en' || legacyLocale === 'es')) {
  params.delete('lang');
  const query = params.toString();
  location.replace(`${localizedPages[locale].path}${query ? `?${query}` : ''}${location.hash}`);
} else {
  const root = document.getElementById('root');
  const app = (
    <React.StrictMode>
      <LocaleProvider locale={locale} variant={variant}>
        <App />
      </LocaleProvider>
    </React.StrictMode>
  );
  const prerenderedLocale = document.documentElement.lang;
  if (variant || isFile || !root.hasChildNodes() || prerenderedLocale !== locale) {
    createRoot(root).render(app);
  } else {
    hydrateRoot(root, app);
  }
  document.documentElement.lang = locale;
  document.title = labels[locale].pageTitle;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', labels[locale].metaDescription);
  if (variant) {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
  }
  installPrintLayout();
  initializeAnalytics();
}
