import { z } from "zod";
import type { SiteContent } from "./types";

export const localeSchema = z.union([z.literal("he"), z.literal("en")]);

export const imageItemSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1, "חובה להזין טקסט אלטרנטיבי"),
});

const pageCommonSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1, "חובה להזין כותרת"),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  hero: imageItemSchema.optional(),
  gallery: z.array(imageItemSchema).optional(),
});

const ctaSchema = z
  .object({
    primaryLabel: z.string().optional(),
    primaryHref: z.string().optional(),
    secondaryLabel: z.string().optional(),
    secondaryHref: z.string().optional(),
  })
  .optional();

const programSchema = z.object({
  title: z.string().min(1, "חובה להזין שם תוכנית"),
  description: z.string().optional(),
  sessionsLabel: z.string().optional(),
  image: imageItemSchema.optional(),
});

const contactFormSchema = z
  .object({
    enabled: z.boolean().optional(),
    submitLabel: z.string().optional(),
    successMessage: z.string().optional(),
  })
  .optional();

const navItemSchema = z.object({
  title: z.string().min(1, "חובה להזין כותרת"),
  path: z.string().min(1, "חובה להזין נתיב"),
  order: z.number().int(),
});

const navigationSchema = z.object({
  header: z.object({
    items: z.array(navItemSchema).nonempty("יש להגדיר לפחות פריט תפריט אחד"),
  }),
  footer: z.object({
    items: z.array(navItemSchema).default([]),
    legal: z.string().optional(),
  }),
});

const metaSchema = z.object({
  titleTemplate: z.string().optional(),
  description: z.string().optional(),
});

const homePageSchema = pageCommonSchema.extend({
  cta: ctaSchema,
});

const academyPageSchema = pageCommonSchema.extend({
  programs: z.array(programSchema).optional(),
});

const contactPageSchema = pageCommonSchema.extend({
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  contactForm: contactFormSchema,
});

export const siteContentSchema = z.object({
  brandName: z.string().min(1, "חובה להזין שם מותג"),
  navigation: navigationSchema,
  meta: metaSchema.optional(),
  pages: z.object({
    home: homePageSchema,
    about: pageCommonSchema,
    academy: academyPageSchema,
    incubator: pageCommonSchema,
    placement: pageCommonSchema,
    contact: contactPageSchema,
  }),
});

export type SiteContentInput = z.input<typeof siteContentSchema>;
export type SiteContentOutput = z.output<typeof siteContentSchema> & SiteContent;
