import { notFound } from "next/navigation";
import { resolveLocale, type AppLocale } from "@/i18n/request";

const copy: Record<AppLocale, { title: string; intro: string; employers: string[]; candidates: string[] }> = {
  he: {
    title: "מרכז ההשמה והאפרנטיסשיפ",
    intro: "מסלול מלא מהכשרה למיקום בשטח עבור מעסיקים ומועמדים.",
    employers: [
      "גיוס מועמדים שנבחרו מראש ומתאימים לצרכים שלכם",
      "תוכנית חניכה מובנית ומדדי ביצוע",
      "מודלים גמישים: ריטיינר, הצלחה או הטמעה",
    ],
    candidates: [
      "מסלולי התמחות בסביבות עבודה אמיתיות",
      "Mentorship צמוד מצוות ORTAM AI",
      "הזדמנות להשתלב בארגונים מובילים",
    ],
  },
  en: {
    title: "Placement & Apprenticeship",
    intro: "A complete path from training to deployment for employers and candidates.",
    employers: [
      "Pre-vetted talent tailored to your AI roadmap",
      "Structured mentorship and performance KPIs",
      "Flexible commercial models: retainer, success, or embed",
    ],
    candidates: [
      "Apprenticeships inside live AI initiatives",
      "Hands-on mentorship from ORTAM AI coaches",
      "Opportunities with municipalities, colleges, and enterprises",
    ],
  },
};

export default function PlacementPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale) ?? notFound();
  const content = copy[locale];

  return (
    <div className="container-page space-y-10 py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-primary-200">{content.title}</h1>
        <p className="text-sm text-slate-200">{content.intro}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold text-accent-200">{locale === "he" ? "למעסיקים" : "For employers"}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {content.employers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold text-accent-200">{locale === "he" ? "למועמדים" : "For candidates"}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {content.candidates.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
