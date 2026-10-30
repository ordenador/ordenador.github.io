import { useLocale } from '../i18n/LocaleContext';
export default function Skills() {
  const { data, labels } = useLocale();
  return (
    <section className="skills-section" aria-labelledby="skills-title">
      <h2 id="skills-title" className="section-title">
        {labels.sections.skills}
      </h2>
      {Object.entries(data.skills).map(([category, skills]) => (
        <div className="skill-group" key={category}>
          <h3>{labels.skillCategories[category] ?? category}</h3>
          <p>{skills.join(' · ')}</p>
        </div>
      ))}
    </section>
  );
}
