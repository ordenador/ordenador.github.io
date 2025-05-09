import React from 'react';
import { resumeData } from '../data/resume';

const Languages = () => {
  const { languages } = resumeData;
  
  return (
    <section className="mb-6 languages-section">
      <h3 className="section-title">Languages</h3>
      {languages.map((language, index) => (
        <p key={index} className="text-gray-600 text-xs mb-0.5">
          <span className="font-semibold">{language.name}:</span> {language.level}
        </p>
      ))}
    </section>
  );
}

export default Languages; 