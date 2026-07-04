import { useLocale } from '../i18n/LocaleContext';

const Interests = () => {
  const { data, labels } = useLocale();

  return (
    <section className="interests-section">
      <h3 className="section-title">{labels.sections.interests}</h3>
      <div>
        {data.interests.map((interest, index) => (
          <span key={index} className="skill-tag">
            {interest}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Interests;
