import React from 'react';
import { resumeData } from '../data/resume';

const Experience = () => {
  return (
    <section className="mb-6 experience-section">
      <h3 className="section-title">Experience</h3>
      {resumeData.experience.map((exp, index) => (
        <React.Fragment key={index}>
          <div className="mb-4 experience-item">
            <div className="flex justify-between items-start">
              <div>
                <p className="entry-title">{exp.title}</p>
                <p className="institution-name">{exp.company}</p>
              </div>
            </div>
            <p className="meta-info">
              <i className="fas fa-calendar-alt mr-2"></i>
              {exp.period}
              {exp.duration && ` · ${exp.duration}`}
              <span className="mx-2">|</span>
              <i className="fas fa-map-marker-alt mr-2"></i>
              {exp.location}
              {exp.workType && ` · ${exp.workType}`}
            </p>
            <ul className="description-list">
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
          {index < resumeData.experience.length - 1 && (
            <hr className="border-dashed border-gray-300" />
          )}
        </React.Fragment>
      ))}
    </section>
  );
}

export default Experience; 