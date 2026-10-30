import { useLocale } from '../i18n/LocaleContext';
import Icon from './Icon';
export default function SocialLinks() {
  const { data, labels } = useLocale();
  return (
    <section className="findme-section" aria-labelledby="links-title">
      <h2 id="links-title" className="section-title">
        {labels.sections.findMeOnline}
      </h2>
      <ul>
        {data.socialLinks.map((link) => (
          <li key={link.platform}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.platform === 'linkedin' ? 'LinkedIn' : 'GitHub'}
              <Icon name="external" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
