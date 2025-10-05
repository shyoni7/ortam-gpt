import type { AppLocale } from "@/i18n/request";

const sections: Record<AppLocale, { title: string; description: string; bullets: string[] }> = {
  he: {
    title: "מרכז ההדרכה של ORTAM AI",
    description: "מסלולי הכשרה מודולריים שמאפשרים לצוותים לאמץ AI בביטחון.",
    bullets: [
      "סדנאות Prompt Engineering והתאמת כלים לתפקיד",
      "מסלולי AI למנהלים, צוותי שיווק, כספים ומשאבי אנוש",
      "ליווי ארגוני עם תוכניות מדידה והטמעה",
    ],
  },
  en: {
    title: "ORTAM AI Academy",
    description: "Modular learning paths that help teams adopt AI with confidence.",
    bullets: [
      "Prompt engineering and tool adaptation workshops",
      "AI pathways for leadership, marketing, finance, and HR",
      "Organizational enablement with measurable adoption plans",
    ],
  },
};

export default function AcademyPage({ params }: { params: { locale: AppLocale } }) {
  const locale = params.locale;
  const content = sections[locale];

  return (
    <div className="container-page space-y-6 py-16">
      <h1 className="text-3xl font-bold text-primary-200">{content.title}</h1>
      <p className="text-sm text-slate-200">{content.description}</p>
      <ul className="grid gap-4 text-sm text-slate-300 md:grid-cols-3">
        {content.bullets.map((item) => (
          <li key={item} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
