import { resumeData } from './data/resume';
import { Header } from './components/Header';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { Profile } from './components/Profile';
import { SocialLinks } from './components/SocialLinks';
import { Skills } from './components/Skills';
import { Languages } from './components/Languages';
import { Certifications } from './components/Certifications';
import { Interests } from './components/Interests';
import './styles/main.css';

function App() {
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
        <Header personalInfo={resumeData.personalInfo} />

        <div className="main-content-grid">
          <div className="left-column">
            <Education education={resumeData.education} />
            <Experience experience={resumeData.experience} />
          </div>

          <div className="right-column profile-column">
            <Profile profile={resumeData.profile} />
            <SocialLinks socialLinks={resumeData.socialLinks} />
            <Skills skills={resumeData.skills} />
            <Languages languages={resumeData.languages} />
            <Certifications certifications={resumeData.certifications} />
            <Interests interests={resumeData.interests} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
