export const siteOrigin = 'https://ordenador.cl';
export const personId = 'https://mfaundez.com/#mario-faundez';
export const localizedPages = {
  es: { path: '/', locale: 'es_CL' },
  en: { path: '/en/', locale: 'en_US' },
};
export function localeFromPath(pathname) {
  return /^\/en(?:\/|$)/.test(pathname) ? 'en' : 'es';
}
