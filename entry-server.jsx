import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App';
import { LocaleProvider } from './src/i18n/LocaleContext';
import { labels } from './src/i18n/labels';
import { localizedPages, siteOrigin, personId } from './site.config.mjs';

export function render(locale) {
  return {
    body: renderToString(
      <React.StrictMode>
        <LocaleProvider locale={locale}>
          <App />
        </LocaleProvider>
      </React.StrictMode>
    ),
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${siteOrigin}${localizedPages[locale].path}#resume`,
      url: siteOrigin + localizedPages[locale].path,
      name: labels[locale].pageTitle,
      description: labels[locale].metaDescription,
      inLanguage: locale,
      mainEntity: {
        '@type': 'Person',
        '@id': personId,
        name: 'Mario Faúndez',
        alternateName: ['Mario Faundez', 'ordenador'],
        url: 'https://mfaundez.com/',
        jobTitle: 'AI Platform Lead (GenOps Lead)',
        worksFor: { '@type': 'Organization', name: 'Grupo Falabella' },
        sameAs: ['https://www.linkedin.com/in/mariofaundez', 'https://github.com/ordenador'],
      },
    },
  };
}
