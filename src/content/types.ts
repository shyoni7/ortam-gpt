import type { AppLocale } from "@/i18n/request";

export type NavigationLink = {
  key: string;
  path: string;
  label: string;
};

export type HomePillar = {
  key: string;
  title: string;
  description: string;
  path: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export type HeroContent = {
  eyebrow: string;
  heading: string;
  subheading: string;
  description: string;
  primaryCta: { label: string; path: string };
  secondaryCta: { label: string; path: string };
  media: { src: string; alt: string };
  gallery: GalleryImage[];
  pillars: HomePillar[];
};

export type AboutContent = {
  title: string;
  paragraphs: string[];
};

export type AcademyProgram = {
  key: string;
  title: string;
  description: string;
  duration: string;
  image: { src: string; alt: string };
};

export type AcademyContent = {
  title: string;
  description: string;
  programs: AcademyProgram[];
};

export type IncubatorContent = {
  title: string;
  description: string;
  stages: { title: string; description: string }[];
};

export type PlacementContent = {
  title: string;
  description: string;
  employersTitle: string;
  employers: string[];
  candidatesTitle: string;
  candidates: string[];
};

export type ContactContent = {
  title: string;
  description: string;
  fields: {
    name: string;
    email: string;
    message: string;
    submit: string;
  };
  successMessage: string;
  errorMessage: string;
};

export type FooterContent = {
  rights: string;
  contact: string;
};

export type NavigationContent = {
  brand: string;
  links: NavigationLink[];
  languageSwitchLabel: string;
};

export type LocaleSiteContent = {
  navigation: NavigationContent;
  home: HeroContent;
  about: AboutContent;
  academy: AcademyContent;
  incubator: IncubatorContent;
  placement: PlacementContent;
  contact: ContactContent;
  footer: FooterContent;
};

export type SiteContent = Record<AppLocale, LocaleSiteContent>;
