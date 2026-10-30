import { useLocale } from '../i18n/LocaleContext';
export default function Interests() {
  const { data, labels } = useLocale();
  return (
    <section className="interests-section" aria-labelledby="interests-title">
      <h2 id="interests-title" className="section-title">
        {labels.sections.interests}
      </h2>
      <p>{data.interests.join(' · ')}</p>
    </section>
  );
}
