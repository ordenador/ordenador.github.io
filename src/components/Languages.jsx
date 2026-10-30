import { useLocale } from '../i18n/LocaleContext';
export default function Languages() {
  const { data, labels } = useLocale();
  return (
    <section className="languages-section" aria-labelledby="languages-title">
      <h2 id="languages-title" className="section-title">
        {labels.sections.languages}
      </h2>
      <dl>
        {data.languages.map((lang, idx) => (
          <div key={idx}>
            <dt>{lang.name}</dt>
            <dd>{lang.level}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
