import React from 'react';
import { useLocale } from '../i18n/LocaleContext';

const Education = () => {
  const { data, labels } = useLocale();

  return (
    <section className="mb-6 education-section">
      <h3 className="section-title">{labels.sections.education}</h3>
      {data.education.map((edu, index) => (
        <React.Fragment key={index}>
          <div
            className={index < data.education.length - 1 ? 'mb-4 education-item' : 'education-item'}
          >
            <p className="entry-title">{edu.degree}</p>
            <p className="institution-name">{edu.institution}</p>
            <div className="meta-info">
              <span>
                <i className="fas fa-calendar-alt"></i>
                {edu.period}
              </span>
              <span>
                <i className="fas fa-map-marker-alt"></i>
                {edu.location}
              </span>
            </div>
            {edu.details && (
              <ul className="description-list">
                {edu.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
          {index < data.education.length - 1 && <hr className="border-dashed border-gray-300" />}
        </React.Fragment>
      ))}
    </section>
  );
};

export default Education;
