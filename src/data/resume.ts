import raw from './resume.json';

export interface Profile {
  name: string;
  headline: string;
  location: string;
  summary: string;
  email: string;
  resumePdf: string;
  links: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface ExperienceEntry {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  tags: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ProjectEntry {
  slug: string;
  title: string;
  summary: string;
  description: string;
  role: string;
  date: string;
  tags: string[];
  links: {
    demo?: string;
    repo?: string;
    caseStudy?: string;
  };
  featured: boolean;
}

export interface Resume {
  profile: Profile;
  targetRoles: string[];
  industry: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  projects: ProjectEntry[];
  certifications: string[];
}

// Single source of truth — every component reads resume data through this module,
// never by importing resume.json directly.
export const resume = raw as Resume;

export const featuredProjects = resume.projects.filter((p) => p.featured);
