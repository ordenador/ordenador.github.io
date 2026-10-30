import { useLocale } from '../i18n/LocaleContext';
import Icon from './Icon';
import { trackContact } from '../analytics';

export default function Header() {
  const { data, labels, locale } = useLocale();
  const { personalInfo } = data;
  return (
    <header className="resume-header">
      <div className="identity">
        <h1>{personalInfo.name}</h1>
        <p className="professional-title">{personalInfo.title}</p>
      </div>
      <div className="contact-info">
        <span>{personalInfo.contact.location}</span>
        <a href={`mailto:${personalInfo.contact.email}`} onClick={() => trackContact(locale)}>
          {personalInfo.contact.email}
        </a>
        <a
          href={`tel:${personalInfo.contact.phone.replace(/[^+\d]/g, '')}`}
          onClick={() => trackContact(locale, 'phone')}
        >
          {personalInfo.contact.phone}
        </a>
        <a
          className="profile-link"
          href={locale === 'en' ? 'https://mfaundez.com/en/' : 'https://mfaundez.com/'}
        >
          {labels.fullProfile}
          <Icon name="external" />
        </a>
      </div>
    </header>
  );
}
