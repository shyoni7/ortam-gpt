import Link from "next/link";
import type { AppLocale } from "@/i18n/request";

const heroContent: Record<AppLocale, { title: string; subtitle: string; primaryCta: string; secondaryCta: string; intro: string } & { pillars: { title: string; description: string; href: string }[] }> = {
  he: {
    title: "ORTAM AI – הגשר בין העולם הישן לעולם של AI",
    subtitle: "חממה טכנולוגית, מרכז הדרכה ומערך השמה במקום אחד",
    primaryCta: "תאמו שיחה",
    secondaryCta: "למידע נוסף",
    intro: "אנחנו עוזרים לעיריות, מוסדות חינוך וארגונים להטמיע פתרונות בינה מלאכותית במהירות ובאחריות.",
    pillars: [
      { title: "חממה טכנולוגית", description: "פיתוח POC, אינטגרציות וסוכני AI.", href: "incubator" },
      { title: "מרכז הדרכה", description: "מסלולי הכשרה מעשיים לפי צוות ותפקיד.", href: "academy" },
      { title: "מרכז השמה", description: "אפרנטיסשיפ ופריסה בארגון הלקוח.", href: "placement" },
    ],
  },
  en: {
    title: "ORTAM AI – Bridging legacy organizations into the AI era",
    subtitle: "Incubator, Academy, and Placement under one roof",
    primaryCta: "Book a call",
    secondaryCta: "Learn more",
    intro: "We help municipalities, colleges, and organizations adopt AI solutions responsibly and fast.",
    pillars: [
      { title: "Incubator", description: "POCs, integrations, and AI agents.", href: "incubator" },
      { title: "Academy", description: "Hands-on upskilling programs tailored to each team.", href: "academy" },
      { title: "Placement", description: "Apprenticeship and embedded AI talent.", href: "placement" },
    ],
  },
};

export default function HomePage({ params }: { params: { locale: AppLocale } }) {
  const locale = params.locale;
  const content = heroContent[locale];

  return (
    <div className="container-page space-y-16 py-16">
      <section className="space-y-6 text-center">
        <span className="inline-flex items-center justify-center rounded-full bg-primary-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-200">
          ORTAM AI
        </span>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{content.title}</h1>
        <p className="mx-auto max-w-3xl text-base text-slate-300">{content.subtitle}</p>
        <p className="mx-auto max-w-2xl text-sm text-slate-400">{content.intro}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary-500/30 transition-transform hover:-translate-y-0.5 hover:bg-primary-400"
            href={`/${locale}/contact`}
          >
            {content.primaryCta}
          </Link>
          <Link
            className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-400 hover:text-accent-200"
            href={`/${locale}/about`}
          >
            {content.secondaryCta}
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {content.pillars.map((pillar) => (
          <div key={pillar.title} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 text-start shadow-sm">
            <h2 className="text-xl font-semibold text-primary-200">{pillar.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{pillar.description}</p>
            <Link
              className="mt-4 inline-flex items-center text-sm font-semibold text-accent-200 transition-colors hover:text-accent-100"
              href={`/${locale}/${pillar.href}`}
            >
              {content.secondaryCta}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
