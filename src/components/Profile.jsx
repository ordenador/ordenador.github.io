import { useLocale } from '../i18n/LocaleContext';
export default function Profile() {
  const { data, labels } = useLocale();
  return (
    <section className="profile-section" aria-labelledby="profile-title">
      <h2 id="profile-title" className="visually-hidden">
        {labels.sections.profile}
      </h2>
      <div
        dangerouslySetInnerHTML={{ __html: data.profile.text.replace(/\n\n/g, '<br /><br />') }}
      />
    </section>
  );
}
