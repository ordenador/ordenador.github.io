import { useLocale } from '../i18n/LocaleContext';

const Languages = () => {
  const { data, labels } = useLocale();

  return (
    <section className="mb-6 languages-section">
      <h3 className="section-title">{labels.sections.languages}</h3>
      {data.languages.map((language, index) => (
        <p key={index} className="text-gray-600 text-xs mb-0.5">
          <span className="font-semibold">{language.name}:</span> {language.level}
        </p>
      ))}
    </section>
  );
};

export default Languages;
