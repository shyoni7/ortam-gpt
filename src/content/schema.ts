import type {
  AcademyPageContent,
  ContactPageContent,
  HomePageContent,
  ImageItem,
  Locale,
  Navigation,
  PageCommon,
  Program,
  SiteContent,
} from "./types";

export type ValidationErrors = Record<string, string>;

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateImage(image: ImageItem | undefined, path: string, errors: ValidationErrors) {
  if (!image) return;
  if (!isNonEmpty(image.url)) {
    errors[`${path}.url`] = "חובה להזין כתובת תמונה";
  }
  if (!isNonEmpty(image.alt)) {
    errors[`${path}.alt`] = "חובה להזין טקסט אלטרנטיבי";
  }
}

function validateGallery(gallery: ImageItem[] | undefined, path: string, errors: ValidationErrors) {
  if (!gallery) return;
  gallery.forEach((item, index) => {
    validateImage(item, `${path}.${index}`, errors);
  });
}

function validateProgram(program: Program, index: number, errors: ValidationErrors) {
  if (!isNonEmpty(program.title)) {
    errors[`pages.academy.programs.${index}.title`] = "חובה להזין שם תוכנית";
  }
  if (program.image) {
    validateImage(program.image, `pages.academy.programs.${index}.image`, errors);
  }
}

function validateNavigation(navigation: Navigation, errors: ValidationErrors) {
  const headerItems = navigation.header?.items ?? [];
  if (!Array.isArray(headerItems) || headerItems.length === 0) {
    errors["navigation.header.items"] = "יש להגדיר לפחות פריט תפריט אחד";
  }
  headerItems.forEach((item, index) => {
    if (!isNonEmpty(item.title)) {
      errors[`navigation.header.items.${index}.title`] = "חובה להזין כותרת";
    }
    if (!isNonEmpty(item.path)) {
      errors[`navigation.header.items.${index}.path`] = "חובה להזין נתיב";
    }
    if (typeof item.order !== "number") {
      errors[`navigation.header.items.${index}.order`] = "יש להזין סדר מספרי";
    }
  });
  const footerItems = navigation.footer?.items ?? [];
  footerItems.forEach((item, index) => {
    if (!isNonEmpty(item.title)) {
      errors[`navigation.footer.items.${index}.title`] = "חובה להזין כותרת";
    }
    if (!isNonEmpty(item.path)) {
      errors[`navigation.footer.items.${index}.path`] = "חובה להזין נתיב";
    }
    if (typeof item.order !== "number") {
      errors[`navigation.footer.items.${index}.order`] = "יש להזין סדר מספרי";
    }
  });
}

function validatePageCommon(page: PageCommon, key: string, errors: ValidationErrors) {
  if (!isNonEmpty(page.slug)) {
    errors[`pages.${key}.slug`] = "חובה להזין נתיב";
  }
  if (!isNonEmpty(page.title)) {
    errors[`pages.${key}.title`] = "חובה להזין כותרת";
  }
  validateImage(page.hero, `pages.${key}.hero`, errors);
  validateGallery(page.gallery, `pages.${key}.gallery`, errors);
}

function validateHomePage(page: HomePageContent, errors: ValidationErrors) {
  validatePageCommon(page, "home", errors);
  if (page.cta) {
    const { primaryLabel, primaryHref, secondaryLabel, secondaryHref } = page.cta;
    if (primaryLabel && !primaryHref) {
      errors["pages.home.cta.primaryHref"] = "חובה להזין קישור ל-CTA הראשי";
    }
    if (primaryHref && !primaryLabel) {
      errors["pages.home.cta.primaryLabel"] = "חובה להזין טקסט ל-CTA הראשי";
    }
    if (secondaryLabel && !secondaryHref) {
      errors["pages.home.cta.secondaryHref"] = "חובה להזין קישור ל-CTA המשני";
    }
    if (secondaryHref && !secondaryLabel) {
      errors["pages.home.cta.secondaryLabel"] = "חובה להזין טקסט ל-CTA המשני";
    }
  }
}

function validateAcademyPage(page: AcademyPageContent, errors: ValidationErrors) {
  validatePageCommon(page, "academy", errors);
  if (Array.isArray(page.programs)) {
    page.programs.forEach((program, index) => validateProgram(program, index, errors));
  }
}

function validateContactPage(page: ContactPageContent, errors: ValidationErrors) {
  validatePageCommon(page, "contact", errors);
  if (page.contactForm) {
    if (page.contactForm.submitLabel && !isNonEmpty(page.contactForm.submitLabel)) {
      errors["pages.contact.contactForm.submitLabel"] = "טקסט הכפתור אינו תקין";
    }
    if (page.contactForm.successMessage && !isNonEmpty(page.contactForm.successMessage)) {
      errors["pages.contact.contactForm.successMessage"] = "הודעת ההצלחה אינה תקינה";
    }
  }
}

function ensurePagesObject(pages: SiteContent["pages"]) {
  const requiredKeys: Array<keyof SiteContent["pages"]> = [
    "home",
    "about",
    "academy",
    "incubator",
    "placement",
    "contact",
  ];
  for (const key of requiredKeys) {
    if (!pages[key]) {
      throw new Error(`Missing page definition for ${String(key)}`);
    }
  }
}

export function parseSiteContent(raw: unknown): SiteContent {
  if (raw === null || typeof raw !== "object") {
    throw new Error("Site content חייב להיות אובייקט");
  }
  const candidate = raw as Partial<SiteContent>;
  if (typeof candidate.brandName !== "string") {
    throw new Error("שדה brandName חסר או אינו מחרוזת");
  }
  if (!candidate.navigation || typeof candidate.navigation !== "object") {
    throw new Error("שדה navigation חסר או אינו אובייקט");
  }
  if (!candidate.pages || typeof candidate.pages !== "object") {
    throw new Error("שדה pages חסר או אינו אובייקט");
  }
  ensurePagesObject(candidate.pages as SiteContent["pages"]);
  const header = (candidate.navigation as Navigation | undefined)?.header;
  const footer = (candidate.navigation as Navigation | undefined)?.footer;
  if (!header || !Array.isArray(header.items)) {
    throw new Error("navigation.header.items חייב להיות מערך");
  }
  if (!footer || !Array.isArray(footer.items)) {
    throw new Error("navigation.footer.items חייב להיות מערך");
  }
  return candidate as SiteContent;
}

export function validateSiteContent(content: SiteContent): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!isNonEmpty(content.brandName)) {
    errors["brandName"] = "חובה להזין שם מותג";
  }
  validateNavigation(content.navigation, errors);
  validateHomePage(content.pages.home, errors);
  validatePageCommon(content.pages.about, "about", errors);
  validateAcademyPage(content.pages.academy, errors);
  validatePageCommon(content.pages.incubator, "incubator", errors);
  validatePageCommon(content.pages.placement, "placement", errors);
  validateContactPage(content.pages.contact, errors);
  return errors;
}

export function assertValidSiteContent(content: SiteContent) {
  const errors = validateSiteContent(content);
  const entries = Object.entries(errors);
  if (entries.length > 0) {
    const message = entries.map(([path, error]) => `${path}: ${error}`).join(", ");
    throw new Error(`Site content validation failed: ${message}`);
  }
}

export function isLocale(value: unknown): value is Locale {
  return value === "he" || value === "en";
}
