import { useLocale } from '../i18n/LocaleContext';

const Profile = () => {
  const { data, labels } = useLocale();

  return (
    <section className="mb-6 profile-section">
      <h3 className="section-title">{labels.sections.profile}</h3>
      <div
        className="text-gray-600 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: data.profile.text.replace(/\n\n/g, '<br /><br />') }}
      />
    </section>
  );
};

export default Profile;
