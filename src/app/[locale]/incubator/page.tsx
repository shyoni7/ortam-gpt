import { notFound } from "next/navigation";
import { resolveLocale, type AppLocale } from "@/i18n/request";

const copy: Record<AppLocale, { title: string; subtitle: string; stages: string[] }> = {
  he: {
    title: "חממת ה-AI של ORTAM",
    subtitle: "בונים יחד מוצרים, סוכנים ואוטומציות עבור הארגון שלכם.",
    stages: [
      "Discovery &amp; אסטרטגיית מוצר",
      "פיתוח MVP/POC וטיוב נתונים",
      "פיילוט עם משתמשים אמיתיים",
      "התרחבות והטמעה מלאה",
    ],
  },
  en: {
    title: "ORTAM AI Incubator",
    subtitle: "Co-creating AI products, agents, and automations for your organization.",
    stages: [
      "Discovery and product strategy",
      "MVP/POC build with data preparation",
      "Pilot with real stakeholders",
      "Scale-up and organization-wide rollout",
    ],
  },
};

export default function IncubatorPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const content = copy[locale];

  return (
    <div className="container-page space-y-8 py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-primary-200">{content.title}</h1>
        <p className="max-w-3xl text-sm text-slate-200">{content.subtitle}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {content.stages.map((stage, index) => (
          <div key={stage} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-200">{index + 1}</span>
            <p className="mt-2 text-sm text-slate-200">{stage}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
