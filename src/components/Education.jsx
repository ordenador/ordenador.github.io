import React from 'react';

const Education = () => {
  return (
    <section className="mb-6 education-section">
      <h3 className="section-title">Education</h3>
      <div className="mb-4 education-item">
        <p className="entry-title">Master's Degree in Artificial Intelligence</p>
        <p className="institution-name">Pontificia Universidad Católica de Chile</p>
        <div className="meta-info">
          <span><i className="fas fa-calendar-alt"></i>2021 - 2022</span>
          <span><i className="fas fa-map-marker-alt"></i>Santiago, Chile</span>
        </div>
      </div>
      <hr className="border-dashed border-gray-300" />
      <div className="mb-4 education-item">
        <p className="entry-title">Diploma, Management and Evaluation of Computing Projects and Projects Management</p>
        <p className="institution-name">Universidad de Chile</p>
        <div className="meta-info">
          <span><i className="fas fa-calendar-alt"></i>06/2013 - 12/2013</span>
          <span><i className="fas fa-map-marker-alt"></i>Santiago, Chile</span>
        </div>
      </div>
      <hr className="border-dashed border-gray-300" />
      <div className="education-item">
        <p className="entry-title">Civil Computer Engineering</p>
        <p className="institution-name">Universidad Tecnológica Metropolitana</p>
        <div className="meta-info">
          <span><i className="fas fa-calendar-alt"></i>2005 - 2010</span>
          <span><i className="fas fa-map-marker-alt"></i>Santiago, Chile</span>
        </div>
        <ul className="description-list">
          <li>Titled with distinction</li>
        </ul>
      </div>
    </section>
  );
}

export default Education; 