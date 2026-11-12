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

export default async function HomePage() {
  const { profile, education, experience, projects, certificates, settings } = await getContent();
  return (
    <>
      <RevealOnScroll />
      <Header name={profile.full_name} />
      <main>
        <Hero profile={profile} />
        <TechStrip />
        <About profile={profile} />
        <EducationSection items={education} />
        <ExperienceSection items={experience} />
        <ProjectsSection items={projects} />
        <CertificatesSection items={certificates} />
        <ResumeSection resumeUrl={profile.resume_url} />
        <ContactSection profile={profile} />
      </main>
      <Footer name={profile.full_name} text={settings.footer_text} />
    </>
  );
}
