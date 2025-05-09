import React from 'react';
import { resumeData } from '../data/resume';

const Interests = () => {
  const { interests } = resumeData;

  return (
    <section className="interests-section">
      <h3 className="section-title">Interests</h3>
      <div>
        {interests.map((interest, index) => (
          <span key={index} className="skill-tag">
            {interest}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Interests;
