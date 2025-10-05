import type { AppLocale } from "@/i18n/request";

const footerText: Record<AppLocale, { rights: string; contact: string }> = {
  he: {
    rights: "© " + new Date().getFullYear() + " ORTAM AI. כל הזכויות שמורות.",
    contact: "יצירת קשר: team@ortam.ai | ‎03-1234567",
  },
  en: {
    rights: `© ${new Date().getFullYear()} ORTAM AI. All rights reserved.`,
    contact: "Contact: team@ortam.ai | +972-3-123-4567",
  },
};

export function Footer({ locale }: { locale: AppLocale }) {
  const content = footerText[locale];

  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/80">
      <div className="container-page flex flex-col gap-2 py-6 text-xs text-slate-400">
        <span>{content.rights}</span>
        <span>{content.contact}</span>
      </div>
    </footer>
  );
}
