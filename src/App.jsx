import Header from './components/Header';
import Profile from './components/Profile';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Languages from './components/Languages';
import Certifications from './components/Certifications';
import Interests from './components/Interests';
import SocialLinks from './components/SocialLinks';
import Icon from './components/Icon';
import { useLocale } from './i18n/LocaleContext';
import { trackContact } from './analytics';

export default function App() {
  const { locale, labels, languageHref, data } = useLocale();
  return (
    <>
      <a className="skip-link" href="#resumeContent">
        {labels.skip}
      </a>
      <div className="site-toolbar" id="downloadPdfBtnContainer">
        <a
          className="site-home"
          href={locale === 'en' ? 'https://mfaundez.com/en/' : 'https://mfaundez.com/'}
        >
          mfaundez.com
          <Icon name="external" />
        </a>
        <div className="toolbar-actions">
          <nav aria-label={labels.language} className="language-switcher">
            {['es', 'en'].map((lang) => (
              <a
                key={lang}
                href={languageHref(lang)}
                lang={lang}
                hrefLang={lang}
                aria-label={lang === 'es' ? 'Español' : 'English'}
                aria-current={locale === lang ? 'page' : undefined}
              >
                {lang.toUpperCase()}
              </a>
            ))}
          </nav>
          <a className="download-pdf-btn" href={labels.pdfHref}>
            <Icon name="download" />
            {labels.downloadPdf}
            <span className="file-format">PDF</span>
          </a>
        </div>
      </div>
      <main
        id="resumeContent"
        className="resume"
        tabIndex="-1"
        data-experience-count={data.experience.length}
      >
        <p className="document-type">{labels.resume}</p>
        <Header />
        <Profile />
        <div className="main-content-grid">
          <Experience />
          <aside
            aria-label={locale === 'es' ? 'Formación y capacidades' : 'Education and capabilities'}
          >
            <Skills />
            <Education />
            <Languages />
            <Certifications />
            <Interests />
            <SocialLinks />
          </aside>
        </div>
      </main>
      <footer className="site-footer">
        <p>Mario Faúndez · {labels.footer}</p>
        <a href={`mailto:${data.personalInfo.contact.email}`} onClick={() => trackContact(locale)}>
          {labels.contact}
          <Icon name="arrow" />
        </a>
      </footer>
    </>
  );
}
