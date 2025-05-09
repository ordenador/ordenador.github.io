import React from 'react';
import { resumeData } from '../data/resume';

const SocialLinks = () => {
  const { socialLinks } = resumeData;

  return (
    <section className="mb-6 findme-section">
      <h3 className="section-title">Find me Online</h3>
      {socialLinks.map((link, index) => (
        <div key={index} className="flex items-center mb-2">
          <i className={`fab fa-${link.platform} text-xl mr-2`}></i>
          <a
            href={link.url}
            target="_blank"
            className="find-me-online-link text-xs"
            rel="noreferrer"
          >
            {link.display}
          </a>
        </div>
      ))}
    </section>
  );
};

export default SocialLinks;
