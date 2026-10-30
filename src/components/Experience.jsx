import { useLocale } from '../i18n/LocaleContext';

function Entry({ exp }) {
  return (
    <article className="experience-item">
      <div className="entry-heading">
        <div>
          <h3>{exp.title}</h3>
          <p className="institution-name">{exp.company}</p>
        </div>
        <p className="entry-period">{exp.period}</p>
      </div>
      <p className="meta-info">
        {[exp.duration, exp.location, exp.workType].filter(Boolean).join(' · ')}
      </p>
      <p className="entry-summary">{exp.responsibilities[0]}</p>
      {exp.responsibilities.length > 1 && (
        <ul className="description-list">
          {exp.responsibilities.slice(1).map((resp, idx) => (
            <li key={idx}>{resp}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function Experience() {
  const { data, labels } = useLocale();
  return (
    <section id="experience" className="experience-section" aria-labelledby="experience-title">
      <h2 id="experience-title" className="section-title">
        {labels.sections.experience}
      </h2>
      {data.experience.slice(0, 3).map((exp, index) => (
        <Entry key={index} exp={exp} />
      ))}
      <details className="career-history">
        <summary>
          {labels.history}
          <span>{labels.historyNote}</span>
        </summary>
        <div className="earlier-experience">
          {data.experience.slice(3).map((exp, index) => (
            <Entry key={index} exp={exp} />
          ))}
        </div>
      </details>
    </section>
  );
}
