// Local previews and automated checks never send production analytics.
export function trackContact(locale, method = 'email') {
  if (window.location.hostname === 'ordenador.cl' && typeof window.gtag === 'function') {
    window.gtag('event', 'contact_click', { language: locale, contact_method: method });
  }
}
export function initializeAnalytics() {
  if (window.location.hostname !== 'ordenador.cl' || navigator.webdriver) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', 'G-DK0JE6F4VC');
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-DK0JE6F4VC';
  document.head.appendChild(script);
}
