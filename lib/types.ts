export type Profile = {
  full_name: string;
  profession: string;
  tagline: string;
  summary: string;
  avatar_url: string;
  bio_title: string;
  bio: string;
  skills: string[];
  interests: string[];
  resume_url: string;
  email: string;
  linkedin: string;
  github: string;
  instagram: string;
  open_to_work: boolean;
};

export type Education = {
  id: string;
  institution: string;
  major: string;
  start_year: string;
  end_year: string;
  description: string;
  sort_order: number;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  kind: string;
  start_date: string;
  end_date: string;
  responsibilities: string;
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  tech: string[];
  demo_url: string;
  repo_url: string;
  published: boolean;
  sort_order: number;
};

export type Certificate = {
  id: string;
  name: string;
  issuer: string;
  issued_at: string;
  proof_url: string;
  sort_order: number;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type SiteSettings = {
  site_title: string;
  meta_description: string;
  footer_text: string;
};

export type Content = {
  profile: Profile;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certificates: Certificate[];
  settings: SiteSettings;
};
