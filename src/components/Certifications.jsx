import { useLocale } from '../i18n/LocaleContext';
export default function Certifications() {
  const { data, labels } = useLocale();
  return (
    <section className="certification-section" aria-labelledby="certifications-title">
      <h2 id="certifications-title" className="section-title">
        {labels.sections.certifications}
      </h2>
      {Object.entries(data.certifications).map(([platform, certs]) => (
        <div className="certification-group" key={platform}>
          <h3>{platform}</h3>
          <ul>
            {certs.map((cert, idx) => (
              <li key={idx}>
                <a href={cert.url} target="_blank" rel="noopener noreferrer">
                  {cert.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
