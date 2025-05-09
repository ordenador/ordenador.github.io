import React from 'react';
import { resumeData } from '../data/resume';

const Profile = () => {
  const { profile } = resumeData;
  
  return (
    <section className="mb-6 profile-section">
      <h3 className="section-title">Profile</h3>
      <div 
        className="text-gray-600 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: profile.text.replace(/\n\n/g, '<br /><br />') }}
      />
    </section>
  );
}

export default Profile; 