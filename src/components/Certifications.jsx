import React from 'react';
import { resumeData } from '../data/resume';

const Certifications = () => {
  const { certifications } = resumeData;
  
  return (
    <section className="mb-6 certification-section">
      <h3 className="section-title">Certification</h3>
      {Object.entries(certifications).map(([platform, certs]) => (
        <div key={platform} className={platform === "Coursera" ? "mb-3" : ""}>
          <h4 className="font-semibold text-gray-700 text-sm mb-1">{platform}</h4>
          <ul className="certification-list-items">
            {certs.map((cert, index) => (
              <li key={index} className="text-gray-600 text-xs">
                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
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

export default Certifications; 