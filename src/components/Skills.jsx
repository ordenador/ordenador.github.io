import { useLocale } from '../i18n/LocaleContext';

const Skills = () => {
  const { data, labels } = useLocale();

  return (
    <section className="mb-6 skills-section">
      <h3 className="section-title">{labels.sections.skills}</h3>
      {Object.entries(data.skills).map(([category, skillList]) => (
        <div key={category} className={category === 'Change Maker' ? 'mb-3' : ''}>
          <h4 className="font-semibold text-gray-700 text-sm mb-1">{category}</h4>
          {skillList.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      ))}
    </section>
  );
};

export default Skills;
