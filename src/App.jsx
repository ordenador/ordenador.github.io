import React, { useEffect } from 'react';
import Header from './components/Header.jsx';
import Education from './components/Education.jsx';
import Experience from './components/Experience.jsx';
import Profile from './components/Profile.jsx';
import SocialLinks from './components/SocialLinks.jsx';
import Skills from './components/Skills.jsx';
import Languages from './components/Languages.jsx';
import Certifications from './components/Certifications.jsx';
import Interests from './components/Interests.jsx';
import { generatePDF } from './utils/pdfGenerator';

function App() {
  useEffect(() => {
    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', async () => {
        try {
          await generatePDF();
        } catch (error) {
          alert('Error al generar el PDF: ' + error.message);
        }
      });
    }
  }, []);

  return (
    <div className="bg-gray-100 p-4 md:p-8">
      <div
        id="downloadPdfBtnContainer"
        className="max-w-5xl mx-auto mb-6 flex justify-center md:justify-end"
      >
        <button id="downloadPdfBtn">
          <i className="fas fa-file-pdf mr-2"></i>
          Download PDF
        </button>
      </div>

      <div
        id="resumeContent"
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-6 md:p-10"
      >
        <Header />

        <div className="main-content-grid">
          <div className="left-column">
            <Education />
            <Experience />
          </div>

          <div className="right-column profile-column">
            <Profile />
            <SocialLinks />
            <Skills />
            <Languages />
            <Certifications />
            <Interests />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
