import { useLocale } from '../i18n/LocaleContext';
export default function Education() {
  const { data, labels } = useLocale();
  return (
    <section className="education-section" aria-labelledby="education-title">
      <h2 id="education-title" className="section-title">
        {labels.sections.education}
      </h2>
      {data.education.map((edu, index) => (
        <article key={index} className="education-item">
          <h3>{edu.degree}</h3>
          <p className="institution-name">{edu.institution}</p>
          <p className="meta-info">
            {edu.period} · {edu.location}
          </p>
          {edu.details?.map((detail, idx) => (
            <p className="education-detail" key={idx}>
              {detail}
            </p>
          ))}
        </article>
      ))}
    </section>
  );
}
