export type Locale = "he" | "en";

export interface ImageItem {
  url: string;
  alt: string;
}

export interface PageCommon {
  slug: string;
  title: string;
  subtitle?: string;
  body?: string;
  hero?: ImageItem;
  gallery?: ImageItem[];
}

export interface Program {
  title: string;
  description: string;
  sessionsLabel?: string;
  image?: ImageItem;
}

export interface HomePageContent extends PageCommon {
  cta?: {
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
}

export interface AboutPageContent extends PageCommon {}
export interface AcademyPageContent extends PageCommon {
  programs?: Program[];
}
export interface IncubatorPageContent extends PageCommon {}
export interface PlacementPageContent extends PageCommon {}

export interface ContactFormConfig {
  enabled?: boolean;
  submitLabel?: string;
  successMessage?: string;
}

export interface ContactPageContent extends PageCommon {
  address?: string;
  phone?: string;
  email?: string;
  contactForm?: ContactFormConfig;
}

export interface NavItem {
  title: string;
  path: string;
  order: number;
}

export interface Navigation {
  header: { items: NavItem[] };
  footer: { items: NavItem[]; legal?: string };
}

export interface MetaDefaults {
  titleTemplate?: string;
  description?: string;
}

export interface SiteContent {
  brandName: string;
  navigation: Navigation;
  meta?: MetaDefaults;
  pages: {
    home: HomePageContent;
    about: AboutPageContent;
    academy: AcademyPageContent;
    incubator: IncubatorPageContent;
    placement: PlacementPageContent;
    contact: ContactPageContent;
  };
}

export type LocaleSiteContent = Record<Locale, SiteContent>;
