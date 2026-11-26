import { getContent } from '@/lib/content';
import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import TechStrip from '@/components/site/TechStrip';
import About from '@/components/site/About';
import EducationSection from '@/components/site/EducationSection';
import ExperienceSection from '@/components/site/ExperienceSection';
import ProjectsSection from '@/components/site/ProjectsSection';
import CertificatesSection from '@/components/site/CertificatesSection';
import ResumeSection from '@/components/site/ResumeSection';
import ContactSection from '@/components/site/ContactSection';
import Footer from '@/components/site/Footer';
import RevealOnScroll from '@/components/site/RevealOnScroll';
import { siteUrl } from '@/lib/site';
import { withSlugs } from '@/lib/projects';

const absolute = (u: string) => (/^https?:\/\//.test(u) ? u : `https://${u}`);

export default async function HomePage() {
  const { profile, education, experience, projects, certificates, settings } = await getContent();
  // Data terstruktur: membantu mesin pencari mengenali namamu sebagai orang/profesi.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.full_name,
    jobTitle: profile.profession,
    url: siteUrl,
    image: new URL(profile.avatar_url || '/images/profile.png', siteUrl).toString(),
    sameAs: [profile.linkedin, profile.github, profile.instagram].filter(Boolean).map(absolute),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <a className="skip" href="#home">
        Lewati ke konten
      </a>
      <RevealOnScroll />
      <Header name={profile.full_name} />
      <main>
        <Hero profile={profile} />
        <TechStrip />
        <About profile={profile} />
        <EducationSection items={education} />
        <ExperienceSection items={experience} />
        <ProjectsSection items={withSlugs(projects)} />
        <CertificatesSection items={certificates} />
        <ResumeSection resumeUrl={profile.resume_url} />
        <ContactSection profile={profile} />
      </main>
      <Footer name={profile.full_name} text={settings.footer_text} />
    </>
  );
}
