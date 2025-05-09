import React from 'react';
import { resumeData } from '../data/resume';

const Header = () => {
  const { personalInfo } = resumeData;

  return (
    <header className="text-center mb-6 md:text-left md:flex md:items-center md:justify-between pdf-avoid-break">
      <div>
        <h1 className="text-3xl font-bold custom-blue">{personalInfo.name}</h1>
        <h2 className="text-lg custom-orange mt-1">
          <strong>{personalInfo.title}</strong>
        </h2>
      </div>
      <div className="mt-4 md:mt-0 text-xs text-gray-600 text-right contact-info">
        <div className="flex items-center justify-center md:justify-end mb-1">
          <i className="fas fa-phone header-icon-blue mr-2"></i>
          <span>{personalInfo.contact.phone}</span>
        </div>
        <div className="flex items-center justify-center md:justify-end mb-1">
          <i className="fas fa-envelope header-icon-blue mr-2"></i>
          <a href={`mailto:${personalInfo.contact.email}`}>{personalInfo.contact.email}</a>
        </div>
        <div className="flex items-center justify-center md:justify-end">
          <i className="fas fa-map-marker-alt header-icon-blue mr-2"></i>
          <span>{personalInfo.contact.location}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
